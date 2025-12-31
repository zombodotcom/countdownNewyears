import { asyncDelay } from '$lib';
import { getActive } from '$lib/server/concurrency';
import { produce } from 'sveltekit-sse';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export const POST = async (event) => {
	if (env.DEV == 'true') return json({});

	return produce(
		async (payload) => {
			while (true) {
				payload.emit('users', String(await getActive(event)));
				await asyncDelay(2500);
			}
		},
		{
			stop: () => {}
		}
	);
};
