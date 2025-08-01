import { defineCollection, z } from 'astro:content';

// Work experience collection
const workCollection = defineCollection({
  type: 'data',
  schema: z.object({
    type: z.enum(['employment', 'project']),
    title: z.string(),
    company: z.string().optional(), // Required for employment, optional for projects
    projectName: z.string().optional(), // Required for projects, optional for employment
    location: z.string().optional(), // Optional for projects
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string(),
    highlights: z.array(z.string()),
    technologies: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
    })),
    url: z.string().url().optional(),
    githubUrl: z.string().url().optional(), // For projects
    liveUrl: z.string().url().optional(), // For projects
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