// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Update this if a custom domain is attached.
export default defineConfig({
  site: 'https://yatharth-anand.vercel.app',
  integrations: [mdx(), sitemap()],
});
