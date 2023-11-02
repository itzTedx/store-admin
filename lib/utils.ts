import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "AED",
});

export function formatSlug(name: string): string {
  // Remove leading and trailing whitespaces
  let trimmedName = name.trim();

  // Replace spaces with hyphens
  let slug = trimmedName.replace(/\s+/g, "-");

  // Convert to lowercase
  slug = slug.toLowerCase();

  return slug;
}
