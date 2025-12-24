import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "$lib/server/db/schema";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			dev: boolean;
			dblocal: LibSQLDatabase<typeof schema>;
			dbprod: DrizzleD1Database<typeof schema>;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				CONCURRENCY: D1Database;
			}
		}
	}
}

export {};
