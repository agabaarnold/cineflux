// @vitest-environment node
import { eq, inArray } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";

import { db } from "#/db";
import { users } from "#/db/schema/auth.schema.ts";
import { watchlist } from "#/db/schema/watchlist.schema.ts";
import {
	addWatchlistEntry,
	getWatchlistEntries,
	removeWatchlistEntry,
} from "#/db/watchlist.ts";
import { watchlistItemSchema } from "#/server/functions/watchlist.ts";

const TEST_USER_ID = "test-user-watchlist";
const OTHER_USER_ID = "test-user-other";
const OLDER_MS = 60_000;

const requireTestDatabase = (): void => {
	const testUrl = process.env.TEST_DATABASE_URL;
	if (!testUrl) {
		throw new Error(
			"TEST_DATABASE_URL is not set. Point DATABASE_URL and TEST_DATABASE_URL at an empty test database."
		);
	}
	if (testUrl !== process.env.DATABASE_URL) {
		throw new Error(
			"TEST_DATABASE_URL must equal DATABASE_URL so tests never run against an unintended database."
		);
	}
};

const resetWatchlist = () =>
	db
		.delete(watchlist)
		.where(inArray(watchlist.userId, [TEST_USER_ID, OTHER_USER_ID]));

const resetUsers = async () => {
	await db.delete(users).where(eq(users.id, TEST_USER_ID));
	await db.delete(users).where(eq(users.id, OTHER_USER_ID));
	await db.insert(users).values([
		{ email: "watchlist-test@example.com", id: TEST_USER_ID, name: "Watch" },
		{ email: "watchlist-other@example.com", id: OTHER_USER_ID, name: "Other" },
	]);
};

describe.skipIf(!process.env.TEST_DATABASE_URL)("watchlist store", () => {
	beforeAll(async () => {
		requireTestDatabase();
		await resetUsers();
	});

	it("adds an entry and fetches it back", async () => {
		await resetWatchlist();

		await addWatchlistEntry(TEST_USER_ID, { mediaId: 550, mediaType: "movie" });
		const entries = await getWatchlistEntries(TEST_USER_ID);

		expect(entries).toEqual([{ mediaId: 550, mediaType: "movie" }]);
	});

	it("ignores duplicate adds", async () => {
		await resetWatchlist();

		await addWatchlistEntry(TEST_USER_ID, { mediaId: 550, mediaType: "movie" });
		await addWatchlistEntry(TEST_USER_ID, { mediaId: 550, mediaType: "movie" });
		const entries = await getWatchlistEntries(TEST_USER_ID);

		expect(entries).toHaveLength(1);
	});

	it("lists newest entries first", async () => {
		await resetWatchlist();

		await db.insert(watchlist).values({
			createdAt: new Date(Date.now() - OLDER_MS),
			mediaId: 1,
			mediaType: "tv",
			userId: TEST_USER_ID,
		});
		await addWatchlistEntry(TEST_USER_ID, { mediaId: 550, mediaType: "movie" });
		const entries = await getWatchlistEntries(TEST_USER_ID);

		expect(entries.map((entry) => entry.mediaId)).toEqual([550, 1]);
	});

	it("scopes entries and removals to the owning user", async () => {
		await resetWatchlist();
		await addWatchlistEntry(TEST_USER_ID, { mediaId: 550, mediaType: "movie" });
		await addWatchlistEntry(OTHER_USER_ID, {
			mediaId: 550,
			mediaType: "movie",
		});

		await removeWatchlistEntry(TEST_USER_ID, {
			mediaId: 550,
			mediaType: "movie",
		});

		expect(await getWatchlistEntries(TEST_USER_ID)).toEqual([]);
		expect(await getWatchlistEntries(OTHER_USER_ID)).toEqual([
			{ mediaId: 550, mediaType: "movie" },
		]);
	});

	it("removing a missing entry is a no-op", async () => {
		await resetWatchlist();

		await removeWatchlistEntry(TEST_USER_ID, {
			mediaId: 999,
			mediaType: "movie",
		});
		expect(await getWatchlistEntries(TEST_USER_ID)).toEqual([]);
	});

	it("rejects invalid input at the schema boundary", () => {
		expect(() =>
			watchlistItemSchema.parse({ mediaId: 1, mediaType: "song" })
		).toThrow();
		expect(
			watchlistItemSchema.parse({ mediaId: 1, mediaType: "movie" })
		).toEqual({ mediaId: 1, mediaType: "movie" });
	});
});
