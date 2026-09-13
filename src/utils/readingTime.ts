import readingTime from "reading-time";

export function getReadingMetrics(content: string) {
  const { minutes: duration, words } = readingTime(content);
  const minutes = Math.ceil(duration);
  return { words, minutes, label: `${minutes} min read` };
}
