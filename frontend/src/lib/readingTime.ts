import readingTime from 'reading-time';
import type { CollectionEntry } from 'astro:content';

/**
 * Build a map of article slug -> reading-time string (e.g. "5 min read").
 * Markdown link/image URLs are stripped before counting so they don't inflate
 * the estimate.
 */
export function getReadingTimes(
  entries: CollectionEntry<'articles'>[]
): Record<string, string> {
  const times: Record<string, string> = {};

  entries.forEach(entry => {
    const cleaned = entry.body
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    times[entry.id] = readingTime(cleaned).text;
  });

  return times;
}
