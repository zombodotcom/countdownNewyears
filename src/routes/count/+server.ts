import { asyncDelay } from '$lib';
import { getActive } from '$lib/server/concurrency';
import { produce } from 'sveltekit-sse';

export const POST = async (event) => {
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