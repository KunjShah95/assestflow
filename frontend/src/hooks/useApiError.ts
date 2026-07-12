"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ToastProvider";
import { getErrorMessage } from "@/lib/errors";
import type { ToastType } from "@/components/ToastProvider";

export function useApiError() {
  const { showToast } = useToast();

  const handleError = useCallback(
    (err: unknown, fallback = "Something went wrong") => {
      const message = getErrorMessage(err, fallback);
      showToast(message, "error");
      return message;
    },
    [showToast]
  );

  const handleSuccess = useCallback(
    (message: string) => showToast(message, "success"),
    [showToast]
  );

  const handleInfo = useCallback(
    (message: string) => showToast(message, "info"),
    [showToast]
  );

  const handleWarning = useCallback(
    (message: string, type: ToastType = "warning") => showToast(message, type),
    [showToast]
  );

  return { handleError, handleSuccess, handleInfo, handleWarning, showToast };
}
