import { tmdbKeys, tmdbQueryOptions } from "#/lib/tmdb-query-cache.ts";
import {
	fetchPersonCombinedCredits,
	fetchPersonDetails,
	fetchPersonExternalIds,
	fetchPersonImages,
	fetchPersonLatest,
	fetchPersonMovieCredits,
	fetchPersonTaggedImages,
	fetchPersonTranslations,
	fetchPersonTvCredits,
	fetchPopularPeople,
} from "#/server/functions/person.ts";

export const fetchPersonDetailsQueryOptions = (
	args: Parameters<typeof fetchPersonDetails>[0]
) =>
	tmdbQueryOptions(tmdbKeys.person.details(args.data), "slow", () =>
		fetchPersonDetails(args)
	);

export const fetchPersonCombinedCreditsQueryOptions = (
	args: Parameters<typeof fetchPersonCombinedCredits>[0]
) =>
	tmdbQueryOptions(tmdbKeys.person.combinedCredits(args.data), "static", () =>
		fetchPersonCombinedCredits(args)
	);

export const fetchPersonMovieCreditsQueryOptions = (
	args: Parameters<typeof fetchPersonMovieCredits>[0]
) =>
	tmdbQueryOptions(tmdbKeys.person.movieCredits(args.data), "static", () =>
		fetchPersonMovieCredits(args)
	);

export const fetchPersonTvCreditsQueryOptions = (
	args: Parameters<typeof fetchPersonTvCredits>[0]
) =>
	tmdbQueryOptions(tmdbKeys.person.tvCredits(args.data), "static", () =>
		fetchPersonTvCredits(args)
	);

export const fetchPersonExternalIdsQueryOptions = (
	args: Parameters<typeof fetchPersonExternalIds>[0]
) =>
	tmdbQueryOptions(tmdbKeys.person.externalIds(args.data), "static", () =>
		fetchPersonExternalIds(args)
	);

export const fetchPersonImagesQueryOptions = (
	args: Parameters<typeof fetchPersonImages>[0]
) =>
	tmdbQueryOptions(tmdbKeys.person.images(args.data), "static", () =>
		fetchPersonImages(args)
	);

export const fetchPersonTaggedImagesQueryOptions = (
	args: Parameters<typeof fetchPersonTaggedImages>[0]
) =>
	tmdbQueryOptions(tmdbKeys.person.taggedImages(args.data), "static", () =>
		fetchPersonTaggedImages(args)
	);

export const fetchPersonTranslationsQueryOptions = (
	args: Parameters<typeof fetchPersonTranslations>[0]
) =>
	tmdbQueryOptions(tmdbKeys.person.translations(args.data), "static", () =>
		fetchPersonTranslations(args)
	);

export const fetchPersonLatestQueryOptions = (
	args: Parameters<typeof fetchPersonLatest>[0]
) =>
	tmdbQueryOptions(tmdbKeys.person.latest(args.data), "lists", () =>
		fetchPersonLatest(args)
	);

export const fetchPopularPeopleQueryOptions = (
	args: Parameters<typeof fetchPopularPeople>[0]
) =>
	tmdbQueryOptions(tmdbKeys.person.popular(args.data), "lists", () =>
		fetchPopularPeople(args)
	);
