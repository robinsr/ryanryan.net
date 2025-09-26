import type { WorkOrProjectItem, KeyTechnology } from '@/content/config'
import type { CollectionEntry } from "astro:content";
import { displayMonthYearRange } from "@/utils/date";


/**
 * Generate a stable anchor ID for a work or project item, suitable for use as an HTML id attribute.
 */
export function makeAnchor(entry: CollectionEntry<'work'>): string {
  return getItemId(entry.data as WorkOrProjectItem)
}

/**
 * Generate a stable ID for a work or project item, suitable for use as a React key or HTML id attribute.
 */
export function getItemId(entry: WorkOrProjectItem): string {
  return [
    entry.company || 'unknown',
    entry.title
  ]
  .join('-')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
}

/**
 * Generate a plain text summary of a work or project item, suitable for copy-pasting into emails or documents.
 */
export function getItemTextSummary(entry: WorkOrProjectItem): string {
  const title =
    entry.type === "employment"
      ? entry.title
      : entry.projectName;
  const subtitle =
    entry.type === "employment" ? entry.company : entry.title;
  const dateRange = displayMonthYearRange(
    entry.startDate,
    entry.endDate,
    entry.current,
  );

  let markdown = `${title}\n\n`;
  markdown += `${subtitle}`;

  if (entry.location) {
    markdown += ` • ${entry.location}`;
  }

  markdown += `\n${dateRange}\n\n`;
  markdown += `${entry.description}\n\n`;

  if (entry.highlights && entry.highlights.length > 0) {
    markdown += `Key Highlights:\n\n`;
    markdown += entry.highlights.map((hl: string) => `- ${hl}`).join("\n");
    markdown += `\n\n`;
  }

  if (entry.technologies && entry.technologies.length > 0) {
    markdown += "🛠 ";
    markdown += entry.technologies
      .map((tech: KeyTechnology) => `(${tech.name})`)
      .join(" ");
  }

  if (entry.githubUrl) {
    markdown += `\n\n`;
    markdown += `🔗 GitHub: ${entry.githubUrl}`;
  }

  return markdown;
}