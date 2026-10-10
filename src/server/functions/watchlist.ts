import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	addWatchlistEntry,
	getWatchlistEntries,
	removeWatchlistEntry,
} from "#/db/watchlist.ts";
import { idSchema } from "#/schemas/common.ts";
import { requireUserId } from "#/server/require-user.ts";

export const watchlistItemSchema = z.object({
	mediaId: idSchema,
	mediaType: z.enum(["movie", "tv", "person"]),
});
export type WatchlistItemInput = z.infer<typeof watchlistItemSchema>;

export const fetchWatchlist = createServerFn({ method: "GET" }).handler(
	async () => {
		const userId = await requireUserId();
		return getWatchlistEntries(userId);
	}
);

export const addToWatchlist = createServerFn({ method: "POST" })
	.validator(watchlistItemSchema)
	.handler(async ({ data }) => {
		const userId = await requireUserId();
		await addWatchlistEntry(userId, data);
		return { ok: true };
	});

export const removeFromWatchlist = createServerFn({ method: "POST" })
	.validator(watchlistItemSchema)
	.handler(async ({ data }) => {
		const userId = await requireUserId();
		await removeWatchlistEntry(userId, data);
		return { ok: true };
	});
