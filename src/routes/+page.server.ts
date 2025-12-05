import { locales } from '$lib/paraglide/runtime.js';
import { fail } from '@sveltejs/kit';

export const load = async (event) => {
	return await event.parent();
};

export const actions = {
	settings: async (event) => {
		const formData = await event.request.formData();

		const customTime = formData.get('hastime')?.toString() === 'on';

		if (
			!formData.has('bg') ||
			(!formData.has('time') && customTime) ||
			(!formData.has('playlist') && formData.get('hasplaylist')?.toString() === 'on')
		) {
			return fail(400, {});
		}

		const langs: string[] = [];
		for (let i = 0; i < locales.length; i++) {
			if (formData.get('lang-' + locales[i])?.toString() === 'on') {
				langs.push(locales[i]);
			}
		}

		event.cookies.set('background', formData.get('bg')?.toString() as string, { path: '/' });
		event.cookies.set('languages', JSON.stringify(langs), { path: '/' });
		event.cookies.set('playlist', (formData.get('playlist')?.toString() as string) ?? '', {
			path: '/'
		});
		event.cookies.set(
			'millisecond',
			String((formData.get('millisecond')?.toString() as string) === 'on'),
			{ path: '/' }
		);
		event.cookies.set('journey', String((formData.get('journey')?.toString() as string) === 'on'), {
			path: '/'
		});

		let time = '';
		if (customTime) {
			time = new Date(formData.get('time')?.toString() as string).toISOString();
		} else {
			time = new Date(new Date().getUTCFullYear() + 1, 0, 1, 0, 0, 0, 0).toISOString();
		}

		event.cookies.set('time', time, { path: '/' });
	}
};
