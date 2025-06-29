import React, { createContext, useContext } from "react";
import { useToast } from "./useToast";

const ToastContext = createContext<{ showToast: ReturnType<typeof useToast>["showToast"] } | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast, ToastWrapper } = useToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {/* Toast overlay */}
      <div
        style={{
          position: "fixed",
          top: 24,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}>
        <div style={{ pointerEvents: "auto" }}>
          <ToastWrapper />
        </div>
      </div>
      {children}
    </ToastContext.Provider>
  );
};

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext must be used within a ToastProvider");
  return ctx;
}
