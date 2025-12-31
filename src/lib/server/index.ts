import type { RequestEvent } from '@sveltejs/kit';
import { PROGRAM_VERSION, DEFAULT_PLAYLIST, HARD_SNOWFLAKE_LIMIT } from '$lib';
import { locales } from '$lib/paraglide/runtime';
import { invalidateAll } from '$app/navigation';

export const COOKIE_VERSION = PROGRAM_VERSION + '.1000';

export const setCookies = async (event: RequestEvent) => {
	const oldCookieVersion = event.cookies.get('set');
	console.log('Cookie ping', oldCookieVersion, '/', COOKIE_VERSION);
	if (oldCookieVersion != COOKIE_VERSION) {
		console.log('Updating some client:', oldCookieVersion, '->', COOKIE_VERSION);
		event.cookies.set('background', '#460809', { path: '/' });
		event.cookies.set('languages', JSON.stringify(locales), { path: '/' });
		event.cookies.set('playlist', DEFAULT_PLAYLIST, { path: '/' });
		event.cookies.set('millisecond', 'false', { path: '/' });
		event.cookies.set('journey', 'true', { path: '/' });
		event.cookies.set('snow', String(Math.trunc(HARD_SNOWFLAKE_LIMIT / 2)), { path: '/' });
		event.cookies.set('set', COOKIE_VERSION, { path: '/' });
		event.cookies.set('time', String(Date.UTC(new Date().getUTCFullYear() + 1, 0, 1, 0, 0, 0, 0)), {
			path: '/'
		});
	}
};
