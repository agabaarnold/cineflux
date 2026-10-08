import {
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./auth.schema";

export const watchlist = pgTable(
	"watchlist",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		mediaType: text("media_type").notNull(),
		mediaId: integer("media_id").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.userId, table.mediaType, table.mediaId],
		}),
	]
);
