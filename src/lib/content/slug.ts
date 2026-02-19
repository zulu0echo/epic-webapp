export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*&\s*/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
