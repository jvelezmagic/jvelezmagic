import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => +b.data.date - +a.data.date);
}

export function readingTime(post: Post) {
  const words = (post.body ?? '').replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const formatDate = (date: Date, month: 'short' | 'long' = 'short') =>
  date.toLocaleDateString('en-US', { day: 'numeric', month, year: 'numeric', timeZone: 'UTC' });
