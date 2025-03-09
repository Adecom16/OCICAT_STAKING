import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function convertFromFloat(value: number, decimals: number): number {
  return value * Math.pow(10, decimals);
}
