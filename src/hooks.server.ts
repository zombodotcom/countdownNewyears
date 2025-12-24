import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { isLimited } from '$lib/server/rate';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

//https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
const securityHeaders = {
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
	'Permissions-Policy': 'camera=(), microphone=(), interest-cohort=()',
	'Cross-Origin-Resource-Policy': 'same-site',
	'Cross-Origin-Opener-Policy': 'same-origin',
	'X-Frame-Options': 'SAMEORIGIN',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin'
};

const handleSecurity: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	Object.entries(securityHeaders).forEach(([header, value]) => response.headers.set(header, value));
	return response;
};

const handleRateLimit: Handle = async ({ event, resolve }) => {
	if (await isLimited(event)) {
		throw error(429, 'Too many requests.');
	}
	return resolve(event);
};

const handleMap: Handle = async ({ event, resolve }) => {
	if(env.DEV == 'true') {
		console.log("Using local map");
		event.locals.dev = true;
	}
	else {
		console.log("Using KV binding map");
		event.locals.dev = false;
	}

	return resolve(event);	
}

export const handle: Handle = sequence(handleMap, handleParaglide, handleSecurity, handleRateLimit);