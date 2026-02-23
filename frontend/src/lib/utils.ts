import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility for conditionally joining CSS class names.
 * Merges Tailwind classes using tailwind-merge and clsx.
 * @param {ClassValue[]} inputs - Array of class names, objects, or arrays.
 * @returns {string} Merged class names string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
