export function parseTags(input: string): string[] {
  return [...new Set(input.trim().split(/[,\s]+/).filter(Boolean))];
}
