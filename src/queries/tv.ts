import { tmdbKeys, tmdbQueryOptions } from "#/lib/tmdb-query-cache.ts";
import {
	fetchTvAggregateCredits,
	fetchTvAiringToday,
	fetchTvAlternativeTitles,
	fetchTvChanges,
	fetchTvContentRatings,
	fetchTvCredits,
	fetchTvEpisodeCredits,
	fetchTvEpisodeDetails,
	fetchTvEpisodeExternalIds,
	fetchTvEpisodeGroupDetails,
	fetchTvEpisodeGroups,
	fetchTvEpisodeImages,
	fetchTvEpisodeTranslations,
	fetchTvEpisodeVideos,
	fetchTvExternalIds,
	fetchTvImages,
	fetchTvKeywords,
	fetchTvLatest,
	fetchTvLists,
	fetchTvOnTheAir,
	fetchTvPopular,
	fetchTvRecommendations,
	fetchTvReviews,
	fetchTvScreenedTheatrically,
	fetchTvSeasonCredits,
	fetchTvSeasonDetails,
	fetchTvSeasonExternalIds,
	fetchTvSeasonImages,
	fetchTvSeasonTranslations,
	fetchTvSeasonVideos,
	fetchTvSeriesDetails,
	fetchTvSimilar,
	fetchTvTopRated,
	fetchTvTranslations,
	fetchTvVideos,
	fetchTvWatchProviders,
} from "#/server/functions/tv.ts";

export const fetchTvSeriesDetailsQueryOptions = (
	args: Parameters<typeof fetchTvSeriesDetails>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.details(args.data), "slow", () =>
		fetchTvSeriesDetails(args)
	);

export const fetchTvAggregateCreditsQueryOptions = (
	args: Parameters<typeof fetchTvAggregateCredits>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.aggregateCredits(args.data), "static", () =>
		fetchTvAggregateCredits(args)
	);

export const fetchTvAlternativeTitlesQueryOptions = (
	args: Parameters<typeof fetchTvAlternativeTitles>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.alternativeTitles(args.data), "static", () =>
		fetchTvAlternativeTitles(args)
	);

export const fetchTvChangesQueryOptions = (
	args: Parameters<typeof fetchTvChanges>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.changes(args.data), "volatile", () =>
		fetchTvChanges(args)
	);

export const fetchTvContentRatingsQueryOptions = (
	args: Parameters<typeof fetchTvContentRatings>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.contentRatings(args.data), "slow", () =>
		fetchTvContentRatings(args)
	);

export const fetchTvCreditsQueryOptions = (
	args: Parameters<typeof fetchTvCredits>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.credits(args.data), "static", () =>
		fetchTvCredits(args)
	);

export const fetchTvEpisodeGroupsQueryOptions = (
	args: Parameters<typeof fetchTvEpisodeGroups>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.episodeGroups(args.data), "static", () =>
		fetchTvEpisodeGroups(args)
	);

export const fetchTvEpisodeGroupDetailsQueryOptions = (
	args: Parameters<typeof fetchTvEpisodeGroupDetails>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.episodeGroupDetails(args.data), "static", () =>
		fetchTvEpisodeGroupDetails(args)
	);

export const fetchTvExternalIdsQueryOptions = (
	args: Parameters<typeof fetchTvExternalIds>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.externalIds(args.data), "static", () =>
		fetchTvExternalIds(args)
	);

export const fetchTvImagesQueryOptions = (
	args: Parameters<typeof fetchTvImages>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.images(args.data), "static", () =>
		fetchTvImages(args)
	);

export const fetchTvKeywordsQueryOptions = (
	args: Parameters<typeof fetchTvKeywords>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.keywords(args.data), "static", () =>
		fetchTvKeywords(args)
	);

export const fetchTvListsQueryOptions = (
	args: Parameters<typeof fetchTvLists>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.lists(args.data), "lists", () =>
		fetchTvLists(args)
	);

export const fetchTvRecommendationsQueryOptions = (
	args: Parameters<typeof fetchTvRecommendations>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.recommendations(args.data), "lists", () =>
		fetchTvRecommendations(args)
	);

export const fetchTvReviewsQueryOptions = (
	args: Parameters<typeof fetchTvReviews>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.reviews(args.data), "lists", () =>
		fetchTvReviews(args)
	);

export const fetchTvScreenedTheatricallyQueryOptions = (
	args: Parameters<typeof fetchTvScreenedTheatrically>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.screenedTheatrically(args.data), "static", () =>
		fetchTvScreenedTheatrically(args)
	);

export const fetchTvSimilarQueryOptions = (
	args: Parameters<typeof fetchTvSimilar>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.similar(args.data), "lists", () =>
		fetchTvSimilar(args)
	);

export const fetchTvTranslationsQueryOptions = (
	args: Parameters<typeof fetchTvTranslations>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.translations(args.data), "static", () =>
		fetchTvTranslations(args)
	);

export const fetchTvVideosQueryOptions = (
	args: Parameters<typeof fetchTvVideos>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.videos(args.data), "static", () =>
		fetchTvVideos(args)
	);

export const fetchTvWatchProvidersQueryOptions = (
	args: Parameters<typeof fetchTvWatchProviders>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.watchProviders(args.data), "slow", () =>
		fetchTvWatchProviders(args)
	);

export const fetchTvSeasonDetailsQueryOptions = (
	args: Parameters<typeof fetchTvSeasonDetails>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.seasonDetails(args.data), "slow", () =>
		fetchTvSeasonDetails(args)
	);

export const fetchTvSeasonCreditsQueryOptions = (
	args: Parameters<typeof fetchTvSeasonCredits>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.seasonCredits(args.data), "static", () =>
		fetchTvSeasonCredits(args)
	);

export const fetchTvSeasonExternalIdsQueryOptions = (
	args: Parameters<typeof fetchTvSeasonExternalIds>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.seasonExternalIds(args.data), "static", () =>
		fetchTvSeasonExternalIds(args)
	);

export const fetchTvSeasonImagesQueryOptions = (
	args: Parameters<typeof fetchTvSeasonImages>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.seasonImages(args.data), "static", () =>
		fetchTvSeasonImages(args)
	);

export const fetchTvSeasonTranslationsQueryOptions = (
	args: Parameters<typeof fetchTvSeasonTranslations>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.seasonTranslations(args.data), "static", () =>
		fetchTvSeasonTranslations(args)
	);

export const fetchTvSeasonVideosQueryOptions = (
	args: Parameters<typeof fetchTvSeasonVideos>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.seasonVideos(args.data), "static", () =>
		fetchTvSeasonVideos(args)
	);

export const fetchTvEpisodeDetailsQueryOptions = (
	args: Parameters<typeof fetchTvEpisodeDetails>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.episodeDetails(args.data), "slow", () =>
		fetchTvEpisodeDetails(args)
	);

export const fetchTvEpisodeCreditsQueryOptions = (
	args: Parameters<typeof fetchTvEpisodeCredits>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.episodeCredits(args.data), "static", () =>
		fetchTvEpisodeCredits(args)
	);

export const fetchTvEpisodeExternalIdsQueryOptions = (
	args: Parameters<typeof fetchTvEpisodeExternalIds>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.episodeExternalIds(args.data), "static", () =>
		fetchTvEpisodeExternalIds(args)
	);

export const fetchTvEpisodeImagesQueryOptions = (
	args: Parameters<typeof fetchTvEpisodeImages>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.episodeImages(args.data), "static", () =>
		fetchTvEpisodeImages(args)
	);

export const fetchTvEpisodeTranslationsQueryOptions = (
	args: Parameters<typeof fetchTvEpisodeTranslations>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.episodeTranslations(args.data), "static", () =>
		fetchTvEpisodeTranslations(args)
	);

export const fetchTvEpisodeVideosQueryOptions = (
	args: Parameters<typeof fetchTvEpisodeVideos>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.episodeVideos(args.data), "static", () =>
		fetchTvEpisodeVideos(args)
	);

export const fetchTvAiringTodayQueryOptions = (
	args: Parameters<typeof fetchTvAiringToday>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.airingToday(args.data), "lists", () =>
		fetchTvAiringToday(args)
	);

export const fetchTvOnTheAirQueryOptions = (
	args: Parameters<typeof fetchTvOnTheAir>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.onTheAir(args.data), "lists", () =>
		fetchTvOnTheAir(args)
	);

export const fetchTvPopularQueryOptions = (
	args: Parameters<typeof fetchTvPopular>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.popular(args.data), "lists", () =>
		fetchTvPopular(args)
	);

export const fetchTvTopRatedQueryOptions = (
	args: Parameters<typeof fetchTvTopRated>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.topRated(args.data), "lists", () =>
		fetchTvTopRated(args)
	);

export const fetchTvLatestQueryOptions = (
	args: Parameters<typeof fetchTvLatest>[0]
) =>
	tmdbQueryOptions(tmdbKeys.tv.latest(args.data), "volatile", () =>
		fetchTvLatest(args)
	);
