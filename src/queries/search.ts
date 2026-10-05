import { tmdbKeys, tmdbQueryOptions } from "#/lib/tmdb-query-cache.ts";
import {
	searchCollections,
	searchCompanies,
	searchKeywords,
	searchMovies,
	searchMulti,
	searchPeople,
	searchTvShows,
} from "#/server/functions/search.ts";

export const searchMoviesQueryOptions = (
	args: Parameters<typeof searchMovies>[0]
) =>
	tmdbQueryOptions(tmdbKeys.search.movies(args.data), "lists", () =>
		searchMovies(args)
	);

export const searchTvShowsQueryOptions = (
	args: Parameters<typeof searchTvShows>[0]
) =>
	tmdbQueryOptions(tmdbKeys.search.tv(args.data), "lists", () =>
		searchTvShows(args)
	);

export const searchPeopleQueryOptions = (
	args: Parameters<typeof searchPeople>[0]
) =>
	tmdbQueryOptions(tmdbKeys.search.people(args.data), "lists", () =>
		searchPeople(args)
	);

export const searchMultiQueryOptions = (
	args: Parameters<typeof searchMulti>[0]
) =>
	tmdbQueryOptions(tmdbKeys.search.multi(args.data), "lists", () =>
		searchMulti(args)
	);

export const searchCollectionsQueryOptions = (
	args: Parameters<typeof searchCollections>[0]
) =>
	tmdbQueryOptions(tmdbKeys.search.collections(args.data), "lists", () =>
		searchCollections(args)
	);

export const searchCompaniesQueryOptions = (
	args: Parameters<typeof searchCompanies>[0]
) =>
	tmdbQueryOptions(tmdbKeys.search.companies(args.data), "lists", () =>
		searchCompanies(args)
	);

export const searchKeywordsQueryOptions = (
	args: Parameters<typeof searchKeywords>[0]
) =>
	tmdbQueryOptions(tmdbKeys.search.keywords(args.data), "lists", () =>
		searchKeywords(args)
	);
