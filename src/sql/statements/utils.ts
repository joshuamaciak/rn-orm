export function trimExtraSpaces(str: string): string {
  const parts = [];
  let prev = str.charAt(0);
  parts.push(prev);
  for (let i = 1; i < str.length; i++) {
    const char = str.charAt(i);
    if (prev === char && char === ' ') {
      prev = char;
      continue;
    }
    parts.push(char);
    prev = char;
  }
  // The above function will reduce all duplicate spaces to one. The
  // final .trim() will remove the extra space on the beginning & end.
  return parts.join('').trim();
}
