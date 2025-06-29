"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "./components/ui/ToastContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <SessionProvider>{children}</SessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
