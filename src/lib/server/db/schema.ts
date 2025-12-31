import { sqliteTable, integer, text, numeric } from 'drizzle-orm/sqlite-core';

export const sessions = sqliteTable('sessions', {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	uuid: text()
		.notNull()
		.$defaultFn(() => crypto.randomUUID())
		.unique(),
	time: numeric()
		.notNull()
		.$defaultFn(() => String(Date.now()))
});
