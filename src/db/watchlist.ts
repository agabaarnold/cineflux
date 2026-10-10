import { and, desc, eq } from "drizzle-orm";

import { db } from "#/db";
import { watchlist } from "#/db/schema";
import type { WatchlistItemInput } from "#/server/functions/watchlist.ts";

export const getWatchlistEntries = (userId: string) =>
	db
		.select({
			mediaId: watchlist.mediaId,
			mediaType: watchlist.mediaType,
		})
		.from(watchlist)
		.where(eq(watchlist.userId, userId))
		.orderBy(desc(watchlist.createdAt));

export const addWatchlistEntry = (userId: string, input: WatchlistItemInput) =>
	db
		.insert(watchlist)
		.values({
			mediaId: input.mediaId,
			mediaType: input.mediaType,
			userId,
		})
		.onConflictDoNothing();

export const removeWatchlistEntry = (
	userId: string,
	input: WatchlistItemInput
) =>
	db
		.delete(watchlist)
		.where(
			and(
				eq(watchlist.userId, userId),
				eq(watchlist.mediaType, input.mediaType),
				eq(watchlist.mediaId, input.mediaId)
			)
		);
