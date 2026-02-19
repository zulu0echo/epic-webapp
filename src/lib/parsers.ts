export function parseJsonArray(value: string | null | undefined): string[] {
  if (value == null || value === "") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function stringifyJsonArray(arr: string[]): string {
  return JSON.stringify(arr);
}
