// components/ui/useToast.tsx
import { useState } from "react";
import { Toast } from "./toaster";

export const useToast = () => {
  const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);

  const showToast = (type: "success" | "error" | "warning", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000); // auto dismiss after 3s
  };

  const ToastWrapper = () => (toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null);
  return { showToast, ToastWrapper };
};
