"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const alertVariants = cva(
  // Layout & base structure
  "relative w-full rounded-lg border px-4 py-3 text-sm grid grid-cols-[1rem_1fr] items-start gap-x-3 gap-y-0.5",
  {
    variants: {
      variant: {
        default:
          // Default (soft neutral card background)
          "bg-card text-card-foreground dark:bg-white/10 dark:text-white/90 border-border [&>svg]:text-current",
        destructive:
          // Destructive (error tone)
          "text-destructive bg-card border-destructive/50 [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        alertVariants({ variant }),
        "bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight text-base",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        "text-slate-600 dark:text-slate-300",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
