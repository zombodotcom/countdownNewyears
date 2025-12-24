import { RateLimiter } from 'sveltekit-rate-limiter/server';
import type { RequestEvent } from '@sveltejs/kit';

const limiter = new RateLimiter({
	IP: [25, 's'],
	IPUA: [25, 's']
});

export const isLimited = async (event: RequestEvent) => {
	if (event.isSubRequest) return; //only rate limit network requests
	const rateLimitStatus = await limiter.check(event);
	return rateLimitStatus.limited;
};
