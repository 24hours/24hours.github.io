import { getCollection, type CollectionEntry } from 'astro:content';
import { siteHref } from './paths';

export type Post = CollectionEntry<'posts'>;

export function postSlug(post: Post): string {
  return post.id.replace(/\.mdx?$/, '');
}

/** Published blog articles only (excludes draft/hidden/unpublished). */
export async function getBlogPosts(): Promise<Post[]> {
  const posts = await getCollection(
    'posts',
    ({ data }) => data.publish !== false && !data.draft && !data.hidden,
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** @deprecated Use getBlogPosts */
export const getPublishedPosts = getBlogPosts;

export function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === 'zh-CN' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function postUrl(post: Post): string {
  return siteHref(`/blog/${postSlug(post)}/`);
}

export function getAdjacentPosts(
  posts: Post[],
  current: Post,
): { prev: Post | null; next: Post | null } {
  const idx = posts.findIndex((p) => p.id === current.id);
  return {
    prev: idx > 0 ? posts[idx - 1]! : null,
    next: idx >= 0 && idx < posts.length - 1 ? posts[idx + 1]! : null,
  };
}
