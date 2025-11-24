import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// src/ui/utils.ts
export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

