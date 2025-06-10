import React, { createContext, useContext, ReactNode } from "react";
import { useToast as useToastHook } from "@/hooks/useToast";
import { ToastOptions } from "@/hooks/useToast";
import { ToastProps } from "@/components/ui/Toast";

interface ToastContextType {
  toasts: ToastProps[];
  success: (options: ToastOptions) => string;
  error: (options: ToastOptions) => string;
  warning: (options: ToastOptions) => string;
  info: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const toastUtils = useToastHook();

  return (
    <ToastContext.Provider value={toastUtils}>{children}</ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
