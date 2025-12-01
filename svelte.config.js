import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: { 
		adapter: adapter(),
		csp: {
			directives: {
				'default-src': ['none'],
				'font-src': ['self', 'fonts.gstatic.com'],
				'script-src': ['self', '*.cloudflare.com', '*.vercel.com', '*.vercel-scripts.com'],
				'object-src': ['self'],
				'img-src': ['self'],
				//sveltekit announcer issue + we use this
				'style-src': ['self', 'fonts.googleapis.com', 'martinbykov.eu', 'unsafe-inline'],
				'frame-ancestors': ['none'],
				'connect-src': ['self'],
				'frame-src': ['*.cloudflare.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com', 'youtube.com', 'www.youtube.com', 'consent.youtube.com']
			},
			// must be specified with either the `report-uri` or `report-to` directives, or both
			reportOnly: {
				'report-uri': ['/']
			},
			mode: 'auto',
		},
		adapter: adapter({
			split: true,
		}),
		csrf: {
			trustedOrigins: ['*.martinbykov.eu', 'http://localhost:5173']
		}
	}
};

export default config;
