import { useState, useCallback } from "react";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove toast after duration (the Toast component handles its own timer)
    // We don't need to set a timeout here since the Toast component will call onClose

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message, duration = 5000) => addToast(message, "success", duration),
    [addToast]
  );
  const error = useCallback(
    (message, duration = 7000) => addToast(message, "error", duration), // Longer duration for errors
    [addToast]
  );
  const info = useCallback(
    (message, duration = 5000) => addToast(message, "info", duration),
    [addToast]
  );
  const warning = useCallback(
    (message, duration = 6000) => addToast(message, "warning", duration),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
};