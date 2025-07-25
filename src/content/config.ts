import { defineCollection, z } from 'astro:content';

// Work experience collection
const workCollection = defineCollection({
  type: 'data',
  schema: z.object({
    company: z.string(),
    title: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string(),
    highlights: z.array(z.string()),
    technologies: z.array(z.string()).optional(),
    url: z.string().url().optional(),
  }),
});

// Blog posts collection
const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    layout: z.string().optional(),
  }),
});

export const collections = {
  'work': workCollection,
  'posts': postsCollection,
}; 