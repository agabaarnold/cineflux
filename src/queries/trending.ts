import { tmdbKeys, tmdbQueryOptions } from "#/lib/tmdb-query-cache.ts";
import { fetchTrending } from "#/server/functions/trending.ts";

export const fetchTrendingQueryOptions = (
	args: Parameters<typeof fetchTrending>[0]
) =>
	tmdbQueryOptions(tmdbKeys.trending.query(args.data), "lists", () =>
		fetchTrending(args)
	);
