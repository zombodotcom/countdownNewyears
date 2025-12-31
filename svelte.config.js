import adapter from '@sveltejs/adapter-netlify';
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
				'default-src': ['self', 'https:', 'http:', 'data:', 'blob:', 'unsafe-inline', 'unsafe-eval'],
				'img-src': ['self', 'https:', 'http:', 'data:', 'blob:'],
				'connect-src': ['self', 'https:', 'http:', 'data:', 'blob:'],
				'worker-src': ['self', 'blob:'],
				'script-src': ['self', 'https:', 'http:', 'unsafe-inline', 'unsafe-eval'],
				'style-src': ['self', 'https:', 'http:', 'unsafe-inline'],
				'font-src': ['self', 'https:', 'http:', 'data:'],
				'frame-src': ['self', 'https:', 'http:'],
				'object-src': ['none']
			},
			// must be specified with either the `report-uri` or `report-to` directives, or both
			reportOnly: {
				'report-uri': ['/']
			},
			mode: 'auto',
		},
		csrf: {
			trustedOrigins: ['festies.martinbykov.eu', 'http://localhost:5173']
		}
	}
};

export default config;
