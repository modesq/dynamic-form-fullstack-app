export const spacing = {
  // Base unit (8px)
  unit: 8,
  
  // Spacing scale
  xs: 0.5,    
  sm: 1,        
  md: 2,      
  lg: 3,      
  xl: 4,      
  xxl: 6,     
  
  // Form-specific spacing
  form: {
    fieldGap: 3,           
    sectionGap: 4,         
    buttonMarginTop: 4,    
    errorMarginTop: 1,     
    labelMarginBottom: 2,  
  },
  
  // Component-specific spacing  
  components: {
    radioGroup: {
      indent: 1,           
      optionGap: 0.5,      
    },
    card: {
      padding: 4,          
    }
  }
} as const;

export const getSpacing = (key: keyof typeof spacing): number => {
  return typeof spacing[key] === 'number' ? spacing[key] : spacing.unit;
};