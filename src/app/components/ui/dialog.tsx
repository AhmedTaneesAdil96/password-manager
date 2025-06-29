import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";
import { ReactNode } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <DialogPrimitive.Portal>
      {" "}
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />{" "}
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black text-white p-6 shadow-lg border-2 border-red",
          className
        )}>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4 text-center">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold leading-none tracking-tight text-white">{children}</h2>;
}
