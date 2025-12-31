import { containsId, removeOld } from '$lib/server/concurrency';
import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

//supports navigator.sendBeacon

export const POST = async (event) => {
	if (env.DEV == 'true') return json({});

	const sessionId = event.cookies.get('sessionid');
	if (!sessionId || !(await containsId(event, sessionId))) {
		return error(404);
	}

	await removeOld(event, sessionId);
	event.cookies.delete('sessionid', { path: '/' });

	console.log('User left');

	return json({});
};
