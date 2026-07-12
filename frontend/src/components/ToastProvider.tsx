"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "info" | "error" | "warning";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const toastConfig: Record<ToastType, { bg: string; border: string; text: string; Icon: typeof CheckCircle }> = {
  success: { bg: "bg-[#F0FDF4]", border: "border-[#10B981]/30", text: "text-[#166534]", Icon: CheckCircle },
  error: { bg: "bg-[#FEF2F2]", border: "border-[#EF4444]/30", text: "text-[#991B1B]", Icon: AlertCircle },
  warning: { bg: "bg-[#FFFBEB]", border: "border-[#F59E0B]/30", text: "text-[#92400E]", Icon: AlertTriangle },
  info: { bg: "bg-[#EFF6FF]", border: "border-[#2563EB]/30", text: "text-[#1E40AF]", Icon: Info },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const { bg, border, text, Icon } = toastConfig[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 ${bg} ${border} ${text}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={18} />
                <span className="text-[14px] font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity p-0.5"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
