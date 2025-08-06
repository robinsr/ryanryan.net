import { getCollection, type CollectionEntry } from 'astro:content';
import type { CollectionType } from '../content/config';

/**
 * Get all published posts (filtered to exclude drafts)
 */
export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts');
  return allPosts.filter(post => !post.data.draft);
}

/**
 * Get all published posts sorted by publication date (newest first)
 */
export async function getPublishedPostsSorted(): Promise<CollectionEntry<'posts'>[]> {
  const publishedPosts = await getPublishedPosts();
  return publishedPosts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/**
 * Get recent published posts (limited by count)
 */
export async function getRecentPosts(count: number = 3): Promise<CollectionEntry<'posts'>[]> {
  const sortedPosts = await getPublishedPostsSorted();
  return sortedPosts.slice(0, count);
}

/**
 * Get published posts filtered by category
 */
export async function getPostsByCategory(category: string): Promise<CollectionEntry<'posts'>[]> {
  const publishedPosts = await getPublishedPosts();
  return publishedPosts
    .filter(post => post.data.category === category)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/**
 * Get published posts filtered by collection
 */
export async function getPostsByCollection(collection: CollectionType): Promise<CollectionEntry<'posts'>[]> {
  const publishedPosts = await getPublishedPosts();
  return publishedPosts
    .filter(post => post.data.collection === collection)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/**
 * Get published posts filtered by tag
 */
export async function getPostsByTag(tag: string): Promise<CollectionEntry<'posts'>[]> {
  const publishedPosts = await getPublishedPosts();
  return publishedPosts
    .filter(post => post.data.tags && post.data.tags.includes(tag))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/**
 * Get all unique categories from published posts
 */
export async function getPublishedCategories(): Promise<string[]> {
  const publishedPosts = await getPublishedPosts();
  const categories = new Set<string>();
  
  publishedPosts.forEach(post => {
    if (post.data.category) {
      categories.add(post.data.category);
    }
  });
  
  return Array.from(categories);
}

/**
 * Get all unique tags from published posts
 */
export async function getPublishedTags(): Promise<string[]> {
  const publishedPosts = await getPublishedPosts();
  const tags = new Set<string>();
  
  publishedPosts.forEach(post => {
    if (post.data.tags) {
      post.data.tags.forEach(tag => tags.add(tag));
    }
  });
  
  return Array.from(tags);
}

/**
 * Get posts grouped by year for archive pages
 */
export async function getPostsByYear(): Promise<Record<number, CollectionEntry<'posts'>[]>> {
  const sortedPosts = await getPublishedPostsSorted();
  
  return sortedPosts.reduce((acc, post) => {
    const year = post.data.pubDate.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, CollectionEntry<'posts'>[]>);
}

/**
 * Get total count of published posts
 */
export async function getPublishedPostsCount(): Promise<number> {
  const publishedPosts = await getPublishedPosts();
  return publishedPosts.length;
} 