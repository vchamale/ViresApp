import { createContext, useState, use, ReactNode } from 'react';
import { Snackbar } from '@react-native-material/core';

type SnackbarOptions = {
  message: string;
  duration?: number;
  color?: string;
};

type SnackbarContextType = {
  showSnackbar: (options: SnackbarOptions) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = use(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar debe ser usado dentro de SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbarOptions, setSnackbarOptions] = useState<SnackbarOptions | null>(null);

  const showSnackbar = (options: SnackbarOptions) => {
    setSnackbarOptions(options);

    setTimeout(() => {
      setSnackbarOptions(null);
    }, options.duration || 3000);
  };

  return (
    <SnackbarContext value={{ showSnackbar }}>
      {children}
      {snackbarOptions && (
        <Snackbar
          message={snackbarOptions.message}
          style={{
            position: 'absolute',
            start: 16,
            end: 16,
            bottom: 30,
            backgroundColor: snackbarOptions.color || 'red',
          }}
        />
      )}
    </SnackbarContext>
  );
};
