"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "./utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentProps<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      className={cn(
        "peer relative inline-flex h-[1.25rem] w-[2.4rem] shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none",
        "data-[state=checked]:bg-[#4B9BEB] data-[state=unchecked]:bg-gray-300",
        "focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",

        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-[1rem] w-[1rem] rounded-full bg-white shadow-md transition-transform",
          "data-[state=checked]:translate-x-[1.35rem] data-[state=unchecked]:translate-x-[0.2rem]"
        )}
      />
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = "Switch";

export { Switch };
