// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: 'https://steipete.me',
	markdown: {
		shikiConfig: {
			theme: 'github-light',
			// Add support for both light and dark modes
			themes: {
				light: 'github-light',
				dark: 'github-dark'
			},
		},
	},
	integrations: [
		mdx(), 
		sitemap(), 
		react(),
		tailwind({
			applyBaseStyles: false,
		})
	],
	vite: {
		resolve: {
			alias: {
				'@': '/src'
			}
		}
	}
});
