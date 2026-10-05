import { tmdbKeys, tmdbQueryOptions } from "#/lib/tmdb-query-cache.ts";
import {
	fetchMovieAlternativeTitles,
	fetchMovieChanges,
	fetchMovieCredits,
	fetchMovieDetails,
	fetchMovieExternalIds,
	fetchMovieImages,
	fetchMovieKeywords,
	fetchMovieLatest,
	fetchMovieLists,
	fetchMovieRecommendations,
	fetchMovieReleaseDates,
	fetchMovieReviews,
	fetchMovieSimilar,
	fetchMovieTranslations,
	fetchMovieVideos,
	fetchMovieWatchProviders,
	fetchNowPlayingMovies,
	fetchPopularMovies,
	fetchTopRatedMovies,
	fetchUpcomingMovies,
} from "#/server/functions/movie.ts";

export const fetchMovieDetailsQueryOptions = (
	args: Parameters<typeof fetchMovieDetails>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.details(args.data), "slow", () =>
		fetchMovieDetails(args)
	);

export const fetchMovieAlternativeTitlesQueryOptions = (
	args: Parameters<typeof fetchMovieAlternativeTitles>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.alternativeTitles(args.data), "static", () =>
		fetchMovieAlternativeTitles(args)
	);

export const fetchMovieChangesQueryOptions = (
	args: Parameters<typeof fetchMovieChanges>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.changes(args.data), "volatile", () =>
		fetchMovieChanges(args)
	);

export const fetchMovieCreditsQueryOptions = (
	args: Parameters<typeof fetchMovieCredits>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.credits(args.data), "static", () =>
		fetchMovieCredits(args)
	);

export const fetchMovieExternalIdsQueryOptions = (
	args: Parameters<typeof fetchMovieExternalIds>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.externalIds(args.data), "static", () =>
		fetchMovieExternalIds(args)
	);

export const fetchMovieImagesQueryOptions = (
	args: Parameters<typeof fetchMovieImages>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.images(args.data), "static", () =>
		fetchMovieImages(args)
	);

export const fetchMovieKeywordsQueryOptions = (
	args: Parameters<typeof fetchMovieKeywords>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.keywords(args.data), "static", () =>
		fetchMovieKeywords(args)
	);

export const fetchMovieListsQueryOptions = (
	args: Parameters<typeof fetchMovieLists>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.lists(args.data), "lists", () =>
		fetchMovieLists(args)
	);

export const fetchMovieRecommendationsQueryOptions = (
	args: Parameters<typeof fetchMovieRecommendations>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.recommendations(args.data), "lists", () =>
		fetchMovieRecommendations(args)
	);

export const fetchMovieReleaseDatesQueryOptions = (
	args: Parameters<typeof fetchMovieReleaseDates>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.releaseDates(args.data), "slow", () =>
		fetchMovieReleaseDates(args)
	);

export const fetchMovieReviewsQueryOptions = (
	args: Parameters<typeof fetchMovieReviews>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.reviews(args.data), "lists", () =>
		fetchMovieReviews(args)
	);

export const fetchMovieSimilarQueryOptions = (
	args: Parameters<typeof fetchMovieSimilar>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.similar(args.data), "lists", () =>
		fetchMovieSimilar(args)
	);

export const fetchMovieTranslationsQueryOptions = (
	args: Parameters<typeof fetchMovieTranslations>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.translations(args.data), "static", () =>
		fetchMovieTranslations(args)
	);

export const fetchMovieVideosQueryOptions = (
	args: Parameters<typeof fetchMovieVideos>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.videos(args.data), "static", () =>
		fetchMovieVideos(args)
	);

export const fetchMovieWatchProvidersQueryOptions = (
	args: Parameters<typeof fetchMovieWatchProviders>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.watchProviders(args.data), "slow", () =>
		fetchMovieWatchProviders(args)
	);

export const fetchMovieLatestQueryOptions = (
	args: Parameters<typeof fetchMovieLatest>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.latest(args.data), "lists", () =>
		fetchMovieLatest(args)
	);

export const fetchNowPlayingMoviesQueryOptions = (
	args: Parameters<typeof fetchNowPlayingMovies>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.nowPlaying(args.data), "lists", () =>
		fetchNowPlayingMovies(args)
	);

export const fetchPopularMoviesQueryOptions = (
	args: Parameters<typeof fetchPopularMovies>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.popular(args.data), "lists", () =>
		fetchPopularMovies(args)
	);

export const fetchTopRatedMoviesQueryOptions = (
	args: Parameters<typeof fetchTopRatedMovies>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.topRated(args.data), "lists", () =>
		fetchTopRatedMovies(args)
	);

export const fetchUpcomingMoviesQueryOptions = (
	args: Parameters<typeof fetchUpcomingMovies>[0]
) =>
	tmdbQueryOptions(tmdbKeys.movie.upcoming(args.data), "lists", () =>
		fetchUpcomingMovies(args)
	);
