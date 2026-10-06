import { tmdbKeys, tmdbQueryOptions } from "#/lib/tmdb-query-cache.ts";
import {
	fetchCollectionDetails,
	fetchCollectionImages,
	fetchCollectionTranslations,
	fetchCompanyAlternativeNames,
	fetchCompanyDetails,
	fetchCompanyImages,
	fetchConfiguration,
	fetchKeywordDetails,
	fetchKeywordMovies,
	fetchMovieGenres,
	fetchNetworkAlternativeNames,
	fetchNetworkDetails,
	fetchTvGenres,
} from "#/server/functions/catalog.ts";

export const fetchMovieGenresQueryOptions = (
	args: Parameters<typeof fetchMovieGenres>[0]
) =>
	tmdbQueryOptions(tmdbKeys.catalog.movieGenres(args.data), "static", () =>
		fetchMovieGenres(args)
	);

export const fetchTvGenresQueryOptions = (
	args: Parameters<typeof fetchTvGenres>[0]
) =>
	tmdbQueryOptions(tmdbKeys.catalog.tvGenres(args.data), "static", () =>
		fetchTvGenres(args)
	);

export const fetchConfigurationQueryOptions = () =>
	tmdbQueryOptions(tmdbKeys.catalog.configuration({}), "static", () =>
		fetchConfiguration()
	);

export const fetchCollectionDetailsQueryOptions = (
	args: Parameters<typeof fetchCollectionDetails>[0]
) =>
	tmdbQueryOptions(tmdbKeys.catalog.collectionDetails(args.data), "slow", () =>
		fetchCollectionDetails(args)
	);

export const fetchCollectionImagesQueryOptions = (
	args: Parameters<typeof fetchCollectionImages>[0]
) =>
	tmdbQueryOptions(tmdbKeys.catalog.collectionImages(args.data), "static", () =>
		fetchCollectionImages(args)
	);

export const fetchCollectionTranslationsQueryOptions = (
	args: Parameters<typeof fetchCollectionTranslations>[0]
) =>
	tmdbQueryOptions(
		tmdbKeys.catalog.collectionTranslations(args.data),
		"static",
		() => fetchCollectionTranslations(args)
	);

export const fetchCompanyDetailsQueryOptions = (
	args: Parameters<typeof fetchCompanyDetails>[0]
) =>
	tmdbQueryOptions(tmdbKeys.catalog.companyDetails(args.data), "slow", () =>
		fetchCompanyDetails(args)
	);

export const fetchCompanyAlternativeNamesQueryOptions = (
	args: Parameters<typeof fetchCompanyAlternativeNames>[0]
) =>
	tmdbQueryOptions(
		tmdbKeys.catalog.companyAlternativeNames(args.data),
		"static",
		() => fetchCompanyAlternativeNames(args)
	);

export const fetchCompanyImagesQueryOptions = (
	args: Parameters<typeof fetchCompanyImages>[0]
) =>
	tmdbQueryOptions(tmdbKeys.catalog.companyImages(args.data), "static", () =>
		fetchCompanyImages(args)
	);

export const fetchNetworkDetailsQueryOptions = (
	args: Parameters<typeof fetchNetworkDetails>[0]
) =>
	tmdbQueryOptions(tmdbKeys.catalog.networkDetails(args.data), "slow", () =>
		fetchNetworkDetails(args)
	);

export const fetchNetworkAlternativeNamesQueryOptions = (
	args: Parameters<typeof fetchNetworkAlternativeNames>[0]
) =>
	tmdbQueryOptions(
		tmdbKeys.catalog.networkAlternativeNames(args.data),
		"static",
		() => fetchNetworkAlternativeNames(args)
	);

export const fetchKeywordDetailsQueryOptions = (
	args: Parameters<typeof fetchKeywordDetails>[0]
) =>
	tmdbQueryOptions(tmdbKeys.catalog.keywordDetails(args.data), "slow", () =>
		fetchKeywordDetails(args)
	);

export const fetchKeywordMoviesQueryOptions = (
	args: Parameters<typeof fetchKeywordMovies>[0]
) =>
	tmdbQueryOptions(tmdbKeys.catalog.keywordMovies(args.data), "lists", () =>
		fetchKeywordMovies(args)
	);
