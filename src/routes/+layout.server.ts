import { locales } from '$lib/paraglide/runtime.js';
import type { LanguageType } from '$lib/types.js';
import { DEFAULT_PLAYLIST } from '$lib';

export const load = async (event) => {
	if (event.cookies.get('set') != 'true') {
		event.cookies.set('background', '#460809', { path: '/' });
		event.cookies.set('languages', JSON.stringify(locales), { path: '/' });
		event.cookies.set('playlist', DEFAULT_PLAYLIST, { path: '/' });
		event.cookies.set('millisecond', 'false', { path: '/' });
		event.cookies.set('journey', 'true', { path: '/' });

		event.cookies.set('set', 'true', { path: '/' });
		event.cookies.set(
			'time',
			new Date(new Date().getUTCFullYear() + 1, 0, 1, 0, 0, 0, 0).toISOString(),
			{ path: '/' }
		);
	}

	return {
		background: event.cookies.get('background') as string,
		languages: JSON.parse(event.cookies.get('languages') as string) as LanguageType[],
		playlist: event.cookies.get('playlist') as string,
		millisecond: (event.cookies.get('millisecond') as string) == 'true',
		journey: (event.cookies.get('journey') as string) == 'true',
		countdown: new Date(event.cookies.get('time') as string)
	};
};
