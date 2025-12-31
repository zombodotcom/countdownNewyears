import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/private';
import * as d1 from 'drizzle-orm/d1';
import * as schema from '$lib/server/db/schema';
import * as libsql from 'drizzle-orm/libsql';

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

let db: undefined | libsql.LibSQLDatabase<typeof schema> = undefined;
const handleMap: Handle = async ({ event, resolve }) => {
	if (env.DEV == 'true') {
		event.locals.dev = true;
		if (!db) {
			db = libsql.drizzle(env.DATABASE_URL ?? 'file:local.db', { schema });
		}
		event.locals.dblocal = db;
	} else {
		event.locals.dev = false;
		event.locals.dbprod = d1.drizzle(event.platform?.env.CONCURRENCY as D1Database, { schema });
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleMap, handleParaglide, handleSecurity);
