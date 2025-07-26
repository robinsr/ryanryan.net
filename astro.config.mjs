// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ryanryan.net',
  output: 'static',
  build: {
    assets: 'assets',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});