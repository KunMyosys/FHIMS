"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "./utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentProps<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none " +
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 " + // standard Tailwind disabled states
          "disabled:cursor-not-allowed disabled:opacity-50", // fallback for direct disabled usage
        className
      )}
      {...props}
    />
  );
});

Label.displayName = "Label";

export { Label };
