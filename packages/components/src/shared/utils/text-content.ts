export function isTextContentEmpty(content: string | undefined): boolean {
  // Check if the content is empty or contains only whitespace
  return !content || content.trim().length === 0 || content.trim() === "<p></p>";
}
