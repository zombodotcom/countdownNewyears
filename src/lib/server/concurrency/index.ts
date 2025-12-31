import { BEAT_FREQUENCY } from '$lib';
import type { RequestEvent } from '@sveltejs/kit';
import * as schema from '$lib/server/db/schema';
import { count, eq, lte } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export const LAST_BEAT_AGE_FOR_ACTIVE = Math.trunc(BEAT_FREQUENCY * 1.25);

export const containsId = async (event: RequestEvent, key: string) => {
	let db;
	if (event.locals.dev) db = event.locals.dblocal;
	else db = event.locals.dbprod;

	try {
		return (
			(await db.select().from(schema.sessions).where(eq(schema.sessions.uuid, key))).length > 0
		);
	} catch (e) {
		// Database table doesn't exist in dev - return false
		if (event.locals.dev) {
			return false;
		}
		throw e;
	}
};

export const updateId = async (event: RequestEvent, key: string) => {
	let db;
	if (event.locals.dev) db = event.locals.dblocal;
	else db = event.locals.dbprod;

	try {
		await db
			.insert(schema.sessions)
			.values({
				uuid: key,
				time: String(Date.now())
			})
			.onConflictDoUpdate({
				set: {
					time: String(Date.now())
				},
				target: schema.sessions.uuid
			});
	} catch (e) {
		// Database table doesn't exist in dev - ignore
		if (event.locals.dev) {
			return;
		}
		throw e;
	}
};

export const removeOld = async (event: RequestEvent, key: string) => {
	let db;
	if (event.locals.dev) db = event.locals.dblocal;
	else db = event.locals.dbprod;

	try {
		await db.delete(schema.sessions).where(eq(schema.sessions.uuid, key));
	} catch (e) {
		// Database table doesn't exist in dev - ignore
		if (event.locals.dev) {
			return;
		}
		throw e;
	}
};

export const getActive = async (event: RequestEvent) => {
	const now = Date.now();

	let db;
	if (event.locals.dev) db = event.locals.dblocal;
	else db = event.locals.dbprod;

	try {
		await db
			.delete(schema.sessions)
			.where(lte(schema.sessions.time, String(now - LAST_BEAT_AGE_FOR_ACTIVE)));

		//shitty workaround
		if (event.locals.dev) {
			return (
				await (db as LibSQLDatabase<typeof schema>).select({ count: count() }).from(schema.sessions)
			)[0].count;
		} else {
			return (
				await (db as DrizzleD1Database<typeof schema>)
					.select({ count: count() })
					.from(schema.sessions)
			)[0].count;
		}
	} catch (e) {
		// Database table doesn't exist in dev - return 0
		if (event.locals.dev) {
			return 0;
		}
		throw e;
	}
};
