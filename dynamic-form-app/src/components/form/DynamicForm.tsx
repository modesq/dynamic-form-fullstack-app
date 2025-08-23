"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Send, Save, Restore, Clear } from "@mui/icons-material";
import { FormConfigResponse, FormSubmission } from "@/types/form.types";
import { ApiService } from "@/services/api.service";
import { LocalStorageService } from "@/services/localStorage.service";
import { useMessageService } from "@/hooks/useMessageService";
import { validateAllFields } from "@/utils/formValidation";
import { FieldRenderer } from "./FieldRenderer";
import { spacing } from "@/utils/spacing";

interface DynamicFormProps {
  initialConfig: FormConfigResponse;
}

export default function DynamicForm({ initialConfig }: DynamicFormProps) {
  const STORAGE_KEY = `dynamic_form_${initialConfig.data[0]?.id || "default"}`;
  const { message, showSuccess, showError, showInfo, clearMessage } =
    useMessageService();

  const initializeFormData = (): FormSubmission => {
    const initialData: FormSubmission = {};
    initialConfig.data.forEach((field) => {
      initialData[field.name] = field.defaultValue || "";
    });
    return initialData;
  };

  const loadFromStorage = useCallback((): FormSubmission => {
    const savedData = LocalStorageService.getFormData(STORAGE_KEY);
    if (!savedData) return initializeFormData();

    const validData: FormSubmission = {};
    initialConfig.data.forEach((field) => {
      if (savedData[field.name] !== undefined) {
        validData[field.name] = savedData[field.name];
      }
    });

    return { ...initializeFormData(), ...validData };
  }, [STORAGE_KEY, initialConfig.data]);

  const [formData, setFormData] = useState<FormSubmission>(
    initializeFormData()
  );
  const [isClient, setIsClient] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedData = loadFromStorage();
    if (Object.keys(savedData).length > 0) {
      setFormData(savedData);
    }
  }, [loadFromStorage]);

  useEffect(() => {
    if (!isClient) return;

    const timeoutId = setTimeout(() => {
      LocalStorageService.saveFormData(STORAGE_KEY, formData);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, STORAGE_KEY, isClient]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSaveToStorage = () => {
    if (!isClient) return;
    LocalStorageService.saveFormData(STORAGE_KEY, formData);
    showInfo("Form data saved locally!");
  };

  const handleRestoreFromStorage = () => {
    if (!isClient) return;
    const savedData = loadFromStorage();
    setFormData(savedData);
    setErrors({});
    showInfo("Form data restored from local storage!");
  };

  const handleClearStorage = () => {
    if (!isClient) return;
    LocalStorageService.clearFormData(STORAGE_KEY);
    setFormData(initializeFormData());
    setErrors({});
    showInfo("Form cleared and local storage removed!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessage();

    const validationErrors = validateAllFields(formData, initialConfig.data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      showError("Please fix the errors below");
      return;
    }

    try {
      await ApiService.submitFormData(formData);
      showSuccess("Form submitted successfully!");
      LocalStorageService.clearFormData(STORAGE_KEY);

      // Reset form with default values
      const defaultData: FormSubmission = {};
      initialConfig.data.forEach((field) => {
        defaultData[field.name] = field.defaultValue || "";
      });
      setFormData(defaultData);
      setErrors({});
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit form";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <CardContent sx={{ p: spacing.components.card.padding }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "#0369a1", fontWeight: "bold" }}
          >
            Dynamic Form
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Save form data locally">
              <IconButton
                onClick={handleSaveToStorage}
                color="primary"
                size="small"
              >
                <Save />
              </IconButton>
            </Tooltip>

            <Tooltip title="Restore from local storage">
              <IconButton
                onClick={handleRestoreFromStorage}
                color="primary"
                size="small"
              >
                <Restore />
              </IconButton>
            </Tooltip>

            <Tooltip title="Clear form and local storage">
              <IconButton
                onClick={handleClearStorage}
                color="secondary"
                size="small"
              >
                <Clear />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ minHeight: 56, mb: spacing.form.sectionGap }}>
          {message ? (
            <Alert severity={message.type}>{message.text}</Alert>
          ) : (
            <Box />
          )}
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {initialConfig.data.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={String(formData[field.name] ?? "")}
              error={errors[field.name]}
              onChange={(value) => handleFieldChange(field.name, value)}
            />
          ))}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            sx={{
              mt: spacing.form.buttonMarginTop,
              bgcolor: "#0369a1",
              "&:hover": { bgcolor: "#0284c7" },
              py: 1.5,
            }}
          >
            {loading ? "Submitting..." : "Submit Form"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
