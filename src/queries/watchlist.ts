import type { QueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";

import type { RowItem } from "#/components/media/media-row.tsx";
import { mapWithConcurrency } from "#/lib/concurrency.ts";
import { STALE_TIME } from "#/lib/tmdb-query-cache.ts";
import { fetchMovieDetailsQueryOptions } from "#/queries/movie.ts";
import { fetchPersonDetailsQueryOptions } from "#/queries/person.ts";
import { fetchTvSeriesDetailsQueryOptions } from "#/queries/tv.ts";
import type { fetchMovieDetails } from "#/server/functions/movie.ts";
import type { fetchPersonDetails } from "#/server/functions/person.ts";
import type { fetchTvSeriesDetails } from "#/server/functions/tv.ts";
import { fetchWatchlist } from "#/server/functions/watchlist.ts";
import { getPosterUrl, getProfileUrl } from "#/server/tmdb/images.ts";

type WatchlistEntries = Awaited<ReturnType<typeof fetchWatchlist>>;
type WatchlistEntry = WatchlistEntries[number];
type MovieDetails = Awaited<ReturnType<typeof fetchMovieDetails>>;
type TvDetails = Awaited<ReturnType<typeof fetchTvSeriesDetails>>;
type PersonDetails = Awaited<ReturnType<typeof fetchPersonDetails>>;

/** Matches the language used by the movie/TV/person detail routes so the
 * same cache entry is reused when a visitor has already opened a title. */
const LANGUAGE = "en-US";

/**
 * TMDB exposes no "fetch many by id" endpoint, so hydrating a watchlist is
 * inherently one request per saved entry. This caps how many are in flight at
 * once so a long list does not burst into TMDB's rate limit.
 */
const HYDRATION_CONCURRENCY = 6;

/**
 * `userId` is `null` while the session is still resolving or when the visitor
 * is a guest. The gate lives here so callers cannot accidentally enable the
 * query against an unknown user id.
 */
export const fetchWatchlistQueryOptions = (userId: string | null) =>
	queryOptions({
		enabled: userId !== null,
		queryFn: () => fetchWatchlist(),
		queryKey: ["watchlist", userId],
		staleTime: 0,
	});

const toMovieRowItem = (details: MovieDetails): RowItem => ({
	href: `/movie/${details.id}`,
	id: `movie-${details.id}`,
	image: getPosterUrl(details.poster_path),
	mediaId: details.id,
	mediaType: "movie",
	overview: details.overview,
	stat: { kind: "rating", value: details.vote_average },
	title: details.title,
	year: details.release_date.slice(0, 4),
});

const toTvRowItem = (details: TvDetails): RowItem => ({
	href: `/tv/${details.id}`,
	id: `tv-${details.id}`,
	image: getPosterUrl(details.poster_path),
	mediaId: details.id,
	mediaType: "tv",
	overview: details.overview,
	stat: { kind: "rating", value: details.vote_average },
	title: details.name,
	year: (details.first_air_date ?? "").slice(0, 4),
});

const toPersonRowItem = (details: PersonDetails): RowItem => ({
	href: `/person/${details.id}`,
	id: `person-${details.id}`,
	image: getProfileUrl(details.profile_path),
	mediaId: details.id,
	mediaType: "person",
	overview: "",
	stat: { kind: "popularity", value: details.popularity },
	title: details.name,
	year: details.known_for_department,
});

/**
 * Resolve one saved entry through the shared query layer, so a title already
 * opened on its detail page is served from cache instead of refetched.
 */
const hydrateEntry = async (
	queryClient: QueryClient,
	entry: WatchlistEntry
): Promise<RowItem> => {
	if (entry.mediaType === "movie") {
		const details = await queryClient.fetchQuery(
			fetchMovieDetailsQueryOptions({
				data: { id: entry.mediaId, language: LANGUAGE },
			})
		);
		return toMovieRowItem(details);
	}
	if (entry.mediaType === "tv") {
		const details = await queryClient.fetchQuery(
			fetchTvSeriesDetailsQueryOptions({
				data: { id: entry.mediaId, language: LANGUAGE },
			})
		);
		return toTvRowItem(details);
	}
	const details = await queryClient.fetchQuery(
		fetchPersonDetailsQueryOptions({
			data: { id: entry.mediaId, language: LANGUAGE },
		})
	);
	return toPersonRowItem(details);
};

/**
 * Hydrate every saved entry into the shape `MediaRow` renders.
 *
 * Entries that fail to resolve are dropped rather than failing the whole
 * list, so one removed or region-blocked title cannot blank the page.
 */
export const watchlistDetailsQueryOptions = (userId: string | null) =>
	queryOptions({
		enabled: userId !== null,
		queryFn: async ({ client }) => {
			if (userId === null) {
				throw new Error("watchlistDetailsQueryOptions requires a user id");
			}
			const entries = await fetchWatchlist();
			const settled = await mapWithConcurrency(
				entries,
				HYDRATION_CONCURRENCY,
				(entry) => hydrateEntry(client, entry)
			);
			return settled.flatMap((result) =>
				result.status === "fulfilled" ? [result.value] : []
			);
		},
		queryKey: ["watchlist", userId, "detailed"],
		staleTime: STALE_TIME.lists,
	});
