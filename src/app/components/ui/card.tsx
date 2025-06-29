import { cn } from "@/app/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-gray-200 bg-black shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-300", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 border border-gray-300 rounded-2xl", className)} {...props} />;
}
