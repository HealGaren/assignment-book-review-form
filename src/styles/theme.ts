import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      text: string;
      textSecondary: string;
      border: string;
      background: string;
      error: string;
    };
    fontSizes: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}

export const theme = {
  colors: {
    primary: '#2563eb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    background: '#ffffff',
    error: '#ef4444',
  },
  fontSizes: {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
  },
};
