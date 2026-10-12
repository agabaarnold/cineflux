import { setTimeout as sleep } from "node:timers/promises";

import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { watchlistDetailsQueryOptions } from "#/queries/watchlist.ts";

interface Harness {
	calls: { id: number; kind: string; language: string | undefined }[];
	entries: { mediaId: number; mediaType: string }[];
	fail: Set<number>;
	inFlight: number;
	peak: number;
}

const harness = vi.hoisted<Harness>(() => ({
	calls: [],
	entries: [],
	fail: new Set<number>(),
	inFlight: 0,
	peak: 0,
}));

/**
 * The query modules are mocked rather than the server functions because each
 * server-function module exports dozens of named bindings; stubbing one would
 * break every other import. Mocking the query layer keeps the wiring under
 * test (which options are called) intact.
 */
const makeOptions = <T extends { id: number }>(
	kind: string,
	data: { id: number; language?: string },
	payload: T
) => ({
	queryKey: ["tmdb", kind, "details", data.id],
	queryFn: async () => {
		harness.calls.push({ id: data.id, kind, language: data.language });
		harness.inFlight += 1;
		harness.peak = Math.max(harness.peak, harness.inFlight);
		await sleep(5);
		harness.inFlight -= 1;
		if (harness.fail.has(data.id)) {
			throw new Error(`${kind} ${data.id} is unavailable`);
		}
		return payload;
	},
});

// oxlint-disable-next-line anti-slop/no-module-mocking
vi.mock("#/server/functions/watchlist.ts", () => ({
	fetchWatchlist: () => Promise.resolve(harness.entries),
}));

// Same isolation rationale as above.
// oxlint-disable-next-line anti-slop/no-module-mocking
vi.mock("#/queries/movie.ts", () => ({
	fetchMovieDetailsQueryOptions: ({
		data,
	}: {
		data: { id: number; language?: string };
	}) =>
		makeOptions("movie", data, {
			id: data.id,
			overview: "A movie overview",
			poster_path: "/movie.jpg",
			release_date: "2020-05-01",
			title: "Movie",
			vote_average: 7.5,
		}),
}));

// Same isolation rationale as above.
// oxlint-disable-next-line anti-slop/no-module-mocking
vi.mock("#/queries/tv.ts", () => ({
	fetchTvSeriesDetailsQueryOptions: ({
		data,
	}: {
		data: { id: number; language?: string };
	}) =>
		makeOptions("tv", data, {
			first_air_date: null,
			id: data.id,
			name: "Show",
			overview: "A show overview",
			poster_path: "/show.jpg",
			vote_average: 8.1,
		}),
}));

// Same isolation rationale as above.
// oxlint-disable-next-line anti-slop/no-module-mocking
vi.mock("#/queries/person.ts", () => ({
	fetchPersonDetailsQueryOptions: ({
		data,
	}: {
		data: { id: number; language?: string };
	}) =>
		makeOptions("person", data, {
			id: data.id,
			known_for_department: "Acting",
			name: "Person",
			popularity: 12.3,
			profile_path: "/person.jpg",
		}),
}));

beforeEach(() => {
	harness.calls = [];
	harness.entries = [];
	harness.fail = new Set();
	harness.inFlight = 0;
	harness.peak = 0;
});

const hydrate = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return queryClient.fetchQuery(watchlistDetailsQueryOptions("user-1"));
};

describe("watchlistDetailsQueryOptions", () => {
	it("is disabled without a resolved user id", () => {
		expect(watchlistDetailsQueryOptions(null).enabled).toBe(false);
		expect(watchlistDetailsQueryOptions("user-1").enabled).toBe(true);
	});

	it("hydrates each media type into a row item", async () => {
		harness.entries = [
			{ mediaId: 550, mediaType: "movie" },
			{ mediaId: 1399, mediaType: "tv" },
			{ mediaId: 287, mediaType: "person" },
		];

		await expect(hydrate()).resolves.toEqual([
			expect.objectContaining({
				href: "/movie/550",
				id: "movie-550",
				image: "https://image.tmdb.org/t/p/w500/movie.jpg",
				mediaId: 550,
				mediaType: "movie",
				overview: "A movie overview",
				stat: { kind: "rating", value: 7.5 },
				title: "Movie",
				year: "2020",
			}),
			expect.objectContaining({
				href: "/tv/1399",
				mediaType: "tv",
				stat: { kind: "rating", value: 8.1 },
				title: "Show",
				// TMDB returns a null first_air_date for some shows.
				year: "",
			}),
			expect.objectContaining({
				href: "/person/287",
				mediaType: "person",
				stat: { kind: "popularity", value: 12.3 },
				title: "Person",
				year: "Acting",
			}),
		]);
	});

	it("hydrates every saved entry", async () => {
		harness.entries = [
			{ mediaId: 1, mediaType: "movie" },
			{ mediaId: 2, mediaType: "tv" },
			{ mediaId: 3, mediaType: "person" },
		];

		await hydrate();

		// The detail routes all request en-US, so matching that locale is what
		// lets a title already opened on its detail page be served from cache.
		expect(harness.calls).toEqual([
			{ id: 1, kind: "movie", language: "en-US" },
			{ id: 2, kind: "tv", language: "en-US" },
			{ id: 3, kind: "person", language: "en-US" },
		]);
	});

	it("drops entries that fail instead of failing the whole list", async () => {
		harness.entries = [
			{ mediaId: 1, mediaType: "movie" },
			{ mediaId: 2, mediaType: "movie" },
			{ mediaId: 3, mediaType: "movie" },
		];
		harness.fail.add(2);

		const rows = await hydrate();

		expect(rows.map((row) => row.mediaId)).toEqual([1, 3]);
	});

	it("caps how many detail requests are in flight", async () => {
		harness.entries = Array.from({ length: 12 }, (_, index) => ({
			mediaId: index + 1,
			mediaType: "movie",
		}));

		await hydrate();

		expect(harness.peak).toBeLessThanOrEqual(6);
		expect(harness.peak).toBeGreaterThan(1);
	});
});
