import { defineCollection, z } from 'astro:content';
import { SITE_CONFIG } from '@/constants';


export interface SocialMeta {
	title: string;
	description: string;
	image: string;
	card: "summary" | "summary_large_image";
}

export type CollectionType = "tutorial" | "article" | "reflection";

export interface PostMeta {
	title: string;
	subtitle?: string;
	description: string;
	pubDate: Date;
	category: string;
	collection: CollectionType;
	tags: string[];
	author: string;
	draft: boolean;
	social?: SocialMeta;
	image?: string;
}



/**
 * The type of key technology used in the work experience.
 */
const KeyTechnologyTypeSchema = z.enum([
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

  // Catch-all category. Use sparringly
  'other',
]);

export type KeyTechnologyType = z.infer<typeof KeyTechnologyTypeSchema>;

/**
 * A key technology used in the work experience.
 */
const KeyTechnologySchema = z.object({
  name: z.string(),
  type: KeyTechnologyTypeSchema.optional(),
  description: z.string().optional(),
});

export type KeyTechnology = z.infer<typeof KeyTechnologySchema>;


/**
 * The type of work experience.
 */
const WorkTypeSchema = z.enum(['employment', 'project']);

export type WorkType = z.infer<typeof WorkTypeSchema>;

/**
 * Defines a single image for a project including the full-size image, optional thumbnail, and alt text.
 */
const ProjectImageSchema = z.object({
  full: z.string(),
  thumbnail: z.string().optional(),
  alt: z.string().optional(),
})

export type ProjectImage = z.infer<typeof ProjectImageSchema>;

/**
 * Defines the set of images for a project including the logo, primary image, and showcase images.
 */
const ProjectImagesSchema = z.object({
  base_url: z.string().optional(),
  logo: ProjectImageSchema.optional(),
  primary: ProjectImageSchema.optional(),
  showcase: z.array(ProjectImageSchema).optional().default([])
})

export type ProjectImages = z.infer<typeof ProjectImagesSchema>;

/**
 * Defines a single skill for a project, eg "Native macOS Development" or "Advanced Tagging & Metadata Systems"
 */
const ProjectSkillSchema = z.object({
  name: z.string(),
  description: z.string(),
})

export type ProjectSkill = z.infer<typeof ProjectSkillSchema>;


/**
 * Describes employment history and personal prjects
 */
const WorkOrProjectItemSchema = z.object({
  type: WorkTypeSchema,
  title: z.string(),
  company: z.string().optional(), // Required for employment, optional for projects
  projectName: z.string().optional(), // Required for projects, optional for employment
  location: z.string().optional(), // Optional for projects
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string(),
  highlights: z.array(z.string()),
  technologies: z.array(KeyTechnologySchema),
  url: z.string().url().optional(),
  githubUrl: z.string().url().optional(), // For projects
  liveUrl: z.string().url().optional(), // For projects
  images: ProjectImagesSchema.optional(),
  topSkills: z.array(ProjectSkillSchema).optional(),
  reflections: z.string().optional(),
});

export type WorkOrProjectItem = z.infer<typeof WorkOrProjectItemSchema>;


/**
 * Sub-schema for social media metadata.
 */
const PostSocialSchema = z.object({
  // Custom title for OG/Twitter (optional override)
  title: z.string().optional().default(SITE_CONFIG.social.title),
  // Social-optimized description
  description: z.string().optional().default(SITE_CONFIG.social.description),
  // Full URL to the OG/Twitter image
  image: z.string().url().optional().default(SITE_CONFIG.social.image),
  // Twitter card type
  card: z.enum(["summary", "summary_large_image"]).optional().default(SITE_CONFIG.social.card), 
})

export type PostSocial = z.infer<typeof PostSocialSchema>;

/**
 * Schema for the frontmatter of blog posts.
 */
const PostFrontmatterSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  author: z.string().default("Ryan Robinson"),
  draft: z.boolean().default(false),
  pubDate: z.coerce.date(),
  category: z.string(),
  collection: z.enum(["tutorial", "article", "reflection"]),
  tags: z.array(z.string()),
  social: PostSocialSchema.optional(),
  image: z.string().optional(),
})

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;



/**
 * The collection of work experience.
 */
const workCollection = defineCollection({
  type: 'data',
  schema: WorkOrProjectItemSchema
});

/**
 * The collection of blog posts.
 */
const postsCollection = defineCollection({
  type: 'content',
  schema: PostFrontmatterSchema
});

export const collections = {
  'work': workCollection,
  'posts': postsCollection,
};