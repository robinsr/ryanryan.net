import { defineCollection, z } from 'astro:content';
import { SITE_CONFIG } from '../constants';


export interface SocialMeta {
	title: string;
	description: string;
	image: string;
	card: "summary" | "summary_large_image";
}

export interface PostMeta {
	title: string;
	subtitle?: string;
	description: string;
	pubDate: Date;
	category: string;
	tags: string[];
	author: string;
	draft: boolean;
	social?: SocialMeta;
	image?: string;
}


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
 * Sub-schema for social media metadata.
 */
const postSocialSchema = z.object({
  // Custom title for OG/Twitter (optional override)
  title: z.string().optional().default(SITE_CONFIG.social.title),
  // Social-optimized description
  description: z.string().optional().default(SITE_CONFIG.social.description),
  // Full URL to the OG/Twitter image
  image: z.string().url().optional().default(SITE_CONFIG.social.image),
  // Twitter card type
  card: z.enum(["summary", "summary_large_image"]).optional().default(SITE_CONFIG.social.card), 
})

/**
 * Schema for the frontmatter of blog posts.
 */
const postFrontmatterSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  author: z.string().default("Ryan Robinson"),
  draft: z.boolean().default(false),
  pubDate: z.coerce.date(),
  category: z.string(),
  tags: z.array(z.string()),
  social: postSocialSchema.optional(),
  image: z.string().optional(),
})

/**
 * The collection of blog posts.
 */
const postsCollection = defineCollection({
  type: 'content',
  schema: postFrontmatterSchema
});

export const collections = {
  'work': workCollection,
  'posts': postsCollection,
};