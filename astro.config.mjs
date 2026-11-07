// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// TODO: replace with the real custom domain once chosen.
export default defineConfig({
  site: 'https://example.dev',
  integrations: [mdx(), sitemap()],
});
