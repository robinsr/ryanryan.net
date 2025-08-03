import { defineCollection, z } from 'astro:content';



/**
 * The type of key technology used in the work experience.
 */
const keyTechnologyTypeSchema = z.enum([
  // Programming, scripting, markup, and stylesheet languages. 
  // Examples: JavaScript, TypeScript, HTML, CSS, SASS, Java, Python
  'language_tech', 
  
  // Frameworks, libraries, build tools, test tools, and dev environments. 
  // Examples: React, SpringBoot, Webpack, Jest, Git
  'framework_tooling', 
  
  // Cloud platforms, deployment tooling, infrastructure-as-code, and major cloud services. 
  // Examples: AWS, Lambda, CloudFormation, Docker, Kubernetes, S3
  'infra_platform', 
  
  // Hands-on practices, workflow habits, and team methodologies that improve product quality and dev velocity. 
  // Examples: Accessibility, CI/CD, Performance Optimization, Agile, UX Collaboration, Cross-platform Development
  'engineering_practice', 
  
  // Structural or design patterns in code and UI—how things are organized and interact. 
  // Examples: Component Architecture, State Management, REST APIs, Event-driven Architecture
  'architecture_pattern', 
  
  // Specific technical or functional capabilities enabled by the system or product, especially things the user can observe or benefit from. 
  // Examples: Keyboard Navigation, Active Window Detection, Offline Mode, Real-time Sync, Desktop App Support
  'system_capability', 
  
  // Project constraints, modalities, and professional settings that influence delivery approach. 
  // Examples: Desktop Application Development, Full-stack Development, Customer-facing Systems, Internal Tools, Contract Work
  'delivery_context',
]);



/**
 * A key technology used in the work experience.
 */
const keyTechnologySchema = z.object({
  name: z.string(),
  type: keyTechnologyTypeSchema.optional(),
  description: z.string().optional(),
});

/**
 * The type of work experience.
 */
const workTypeSchema = z.enum(['employment', 'project']);

/**
 * The collection of work experience.
 */
const workCollection = defineCollection({
  type: 'data',
  schema: z.object({
    type: workTypeSchema,
    title: z.string(),
    company: z.string().optional(), // Required for employment, optional for projects
    projectName: z.string().optional(), // Required for projects, optional for employment
    location: z.string().optional(), // Optional for projects
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string(),
    highlights: z.array(z.string()),
    technologies: z.array(keyTechnologySchema),
    url: z.string().url().optional(),
    githubUrl: z.string().url().optional(), // For projects
    liveUrl: z.string().url().optional(), // For projects
  }),
});

/**
 * The collection of blog posts.
 */
const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    layout: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  'work': workCollection,
  'posts': postsCollection,
};