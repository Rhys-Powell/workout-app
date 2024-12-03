export function extractSubstring(str: string, marker: string) {
    const index = str.indexOf(marker);
  if (index !== -1) {
    return str.substring(index + 1);
  }
  return str;
  }