import { containsId, removeOld } from '$lib/server/concurrency';
import { error, json } from '@sveltejs/kit';

//supports navigator.sendBeacon
//keep session in map (1000 write to different keys/day)

export const POST = async (event) => {
	const sessionId = event.cookies.get('sessionid');
	if (!sessionId || !(await containsId(event, sessionId))) {
		return error(404);
	}

	await removeOld(event, sessionId);

	console.log('User left');

	return json({});
};