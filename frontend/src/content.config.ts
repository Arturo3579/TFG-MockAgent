import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro:content';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string(),
    lastReviewed: z.string(),
    targetKeyword: z.string(),
    vertical: z.enum(['life', 'auto', 'health', 'home', 'general']),
    topic: z.enum(['workflows', 'tutorials', 'compliance', 'reviews']).nullable(),
  })
});

export const collections = {
  articles,
};
