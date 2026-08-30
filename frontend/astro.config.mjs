// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.mockagentai.com',
  output: 'static',
  integrations: [sitemap(), mdx()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  build: {
    format: 'directory'
  }
});
