import { useState, useCallback } from 'react';

export type MessageType = 'success' | 'error' | 'info';

export interface Message {
  type: MessageType;
  text: string;
}

export const useMessageService = (defaultTimeout = 3000) => {
  const [message, setMessage] = useState<Message | null>(null);

  const showMessage = useCallback((type: MessageType, text: string, timeout?: number) => {
    setMessage({ type, text });
    
    setTimeout(() => {
      setMessage(null);
    }, timeout || defaultTimeout);
  }, [defaultTimeout]);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return {
    message,
    showMessage,
    clearMessage,
    showSuccess: (text: string, timeout?: number) => showMessage('success', text, timeout),
    showError: (text: string, timeout?: number) => showMessage('error', text, timeout),
    showInfo: (text: string, timeout?: number) => showMessage('info', text, timeout),
  };
};