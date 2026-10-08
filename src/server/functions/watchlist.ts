import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "#/db";
import { watchlist } from "#/db/schema";
import { auth } from "#/lib/auth.ts";
import { idSchema } from "#/schemas/common.ts";

export const watchlistItemSchema = z.object({
	mediaId: idSchema,
	mediaType: z.enum(["movie", "tv", "person"]),
});
export type WatchlistItemInput = z.infer<typeof watchlistItemSchema>;

const requireUserId = async (): Promise<string> => {
	const session = await auth.api.getSession({ headers: getRequestHeaders() });
	if (!session) {
		throw new Error("Unauthorized");
	}
	return session.user.id;
};

export const fetchWatchlist = createServerFn({ method: "GET" }).handler(
	async () => {
		const userId = await requireUserId();
		return db
			.select({
				mediaId: watchlist.mediaId,
				mediaType: watchlist.mediaType,
			})
			.from(watchlist)
			.where(eq(watchlist.userId, userId))
			.orderBy(desc(watchlist.createdAt));
	}
);

export const addToWatchlist = createServerFn({ method: "POST" })
	.validator(watchlistItemSchema)
	.handler(async ({ data }) => {
		const userId = await requireUserId();
		await db
			.insert(watchlist)
			.values({
				mediaId: data.mediaId,
				mediaType: data.mediaType,
				userId,
			})
			.onConflictDoNothing();
		return { ok: true };
	});

export const removeFromWatchlist = createServerFn({ method: "POST" })
	.validator(watchlistItemSchema)
	.handler(async ({ data }) => {
		const userId = await requireUserId();
		await db
			.delete(watchlist)
			.where(
				and(
					eq(watchlist.userId, userId),
					eq(watchlist.mediaType, data.mediaType),
					eq(watchlist.mediaId, data.mediaId)
				)
			);
		return { ok: true };
	});
