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
  // Replace spaces with hyphens
  let slug = name
    .toLowerCase() // Converts the string to lowercase
    .trim() // Removes leading and trailing whitespace
    .replace(/[^\w\s-]/g, "") // Replaces characters that are not word characters, spaces, or hyphens with an empty string
    .replace(/[\s_-]+/g, "-") // Replaces one or more consecutive spaces, underscores, or hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Removes hyphens from the beginning and end of the string;

  return slug;
}
