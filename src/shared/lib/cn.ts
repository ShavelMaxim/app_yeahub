type ClassValue = string | false | null | undefined;

/** Joins already-resolved CSS Module class names and optional external classes. */
export const cn = (...values: ClassValue[]) => values.filter(Boolean).join(' ');
