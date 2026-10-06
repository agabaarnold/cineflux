import { tmdbKeys, tmdbQueryOptions } from "#/lib/tmdb-query-cache.ts";
import {
	discoverMovies,
	discoverTvShows,
} from "#/server/functions/discover.ts";

export const discoverMoviesQueryOptions = (
	args: Parameters<typeof discoverMovies>[0]
) =>
	tmdbQueryOptions(tmdbKeys.discover.movies(args.data), "lists", () =>
		discoverMovies(args)
	);

export const discoverTvShowsQueryOptions = (
	args: Parameters<typeof discoverTvShows>[0]
) =>
	tmdbQueryOptions(tmdbKeys.discover.tv(args.data), "lists", () =>
		discoverTvShows(args)
	);
