import { defineConfig } from 'astro/config';

// The original, versioned logos and custom fonts remain untouched in /assets.
// Astro exposes this directory at / so they are available at their real names.
export default defineConfig({
  site: 'https://dawnlightlabs.com',
  output: 'static',
  publicDir: './assets',
});
