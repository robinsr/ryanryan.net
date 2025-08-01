import type { CollectionEntry } from "astro:content";


export function makeAnchor(entry: CollectionEntry<'work'>): string {
  // replace spaces with hyphens and lowercase
  const anchor = entry.data.type === 'employment' ? entry.data.title : entry.data.projectName;

  return anchor?.replace(/\s+/g, '-').toLowerCase() || '';
}