import readingTime from "reading-time";

export function calculateReadingTime(content: string): string {
  const stats = readingTime(content);
  const minutes = Math.ceil(stats.minutes);
  return `${minutes} min read`;
}
