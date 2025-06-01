import readingTime from 'reading-time';
import { getCollection } from 'astro:content';

export function calculateReadingTime(content: string): string {
  const stats = readingTime(content);
  const minutes = Math.ceil(stats.minutes);
  return `${minutes} min read`;
}

export async function getReadingTime(postId: string): Promise<string> {
  const posts = await getCollection('blog');
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return '5 min read'; // fallback
  }
  
  return calculateReadingTime(post.body);
}