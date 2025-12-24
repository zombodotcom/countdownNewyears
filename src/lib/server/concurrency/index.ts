import { BEAT_FREQUENCY } from '$lib';
import type { RequestEvent } from '@sveltejs/kit';
import { SvelteMap } from 'svelte/reactivity';

export const LAST_BEAT_AGE_FOR_ACTIVE = Math.trunc(BEAT_FREQUENCY * 1.25);

export const localConcurrencyMap: SvelteMap<string, number> = new SvelteMap();

export const containsId = async (event: RequestEvent, key: string) => {
	if (event.locals.dev) return event.locals.localmap.has(key);
	else return ((await event.locals.prodmap.get(key)) != null);
};

export const updateId = async (event: RequestEvent, key: string) => {
	if (event.locals.dev) event.locals.localmap.set(key, Date.now());
	else await event.locals.prodmap.put(key, String(Date.now()), { expirationTtl: LAST_BEAT_AGE_FOR_ACTIVE });
};

export const removeOld = async (event: RequestEvent, key: string) => {
	if (event.locals.dev) event.locals.localmap.delete(key);
	else await event.locals.prodmap.delete(key);
};

export const getActive = async (event: RequestEvent) => {
	const now = Date.now();

	if (event.locals.dev) {
		event.locals.localmap.forEach((value, key, map) => {
			if (now - value > LAST_BEAT_AGE_FOR_ACTIVE) {
				map.delete(key);
			}
		});
		return event.locals.localmap.size;
	}
	else {
		const keys = [];
		let list = undefined;
		do {
			list = await event.locals.prodmap.list({
				cursor: list == undefined ? undefined : list.cursor
			});
			keys.push(...list.keys);
		}
		while (!list.list_complete);
		return keys.length;
	}
};
