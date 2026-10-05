import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	imageResultsSchema,
	reviewsSchema,
	videoResultsSchema,
} from "#/schemas/aggregate.ts";
import { idSchema } from "#/schemas/common.ts";
import {
	buildMovieAppendToResponse,
	movieAlternativeTitlesSchema,
	movieAppendToResponseSchema,
	movieChangesSchema,
	movieCreditsSchema,
	movieDetailSchema,
	movieDetailsWithAppendSchema,
	movieExternalIdsSchema,
	movieKeywordsSchema,
	movieListsSchema,
	movieNowPlayingResultsSchema,
	movieQueryParamsSchema,
	movieReleaseDatesSchema,
	movieResultsSchema,
	movieTranslationsSchema,
	movieWatchProvidersSchema,
} from "#/schemas/movie.ts";
import { tmdbFetchValidated } from "#/server/tmdb/client.ts";

const movieIdInputSchema = z.object({
	id: idSchema,
	language: z.string().min(2).optional(),
});

const movieIdPageInputSchema = movieIdInputSchema.extend({
	page: z.number().int().positive().optional(),
});

export const fetchMovieDetails = createServerFn({ method: "GET" })
	.validator(
		movieIdInputSchema.extend({
			append_to_response: z
				.array(movieAppendToResponseSchema)
				.max(20)
				.optional(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/${data.id}`, movieDetailsWithAppendSchema, {
			params: {
				append_to_response: buildMovieAppendToResponse(
					data.append_to_response ?? []
				),
				language: data.language,
			},
		})
	);

export const fetchMovieAlternativeTitles = createServerFn({ method: "GET" })
	.validator(movieIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/movie/${data.id}/alternative_titles`,
			movieAlternativeTitlesSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchMovieChanges = createServerFn({ method: "GET" })
	.validator(
		movieIdInputSchema.extend({
			end_date: z.string().optional(),
			start_date: z.string().optional(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/${data.id}/changes`, movieChangesSchema, {
			params: {
				end_date: data.end_date,
				start_date: data.start_date,
			},
		})
	);

export const fetchMovieCredits = createServerFn({ method: "GET" })
	.validator(movieIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/${data.id}/credits`, movieCreditsSchema, {
			params: { language: data.language },
		})
	);

export const fetchMovieExternalIds = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/${data.id}/external_ids`, movieExternalIdsSchema)
	);

export const fetchMovieImages = createServerFn({ method: "GET" })
	.validator(movieIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/${data.id}/images`, imageResultsSchema, {
			params: { language: data.language },
		})
	);

export const fetchMovieKeywords = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/${data.id}/keywords`, movieKeywordsSchema)
	);

export const fetchMovieLists = createServerFn({ method: "GET" })
	.validator(movieIdPageInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/${data.id}/lists`, movieListsSchema, {
			params: { language: data.language, page: data.page },
		})
	);

export const fetchMovieRecommendations = createServerFn({ method: "GET" })
	.validator(movieIdPageInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/movie/${data.id}/recommendations`,
			movieResultsSchema,
			{ params: { language: data.language, page: data.page } }
		)
	);

export const fetchMovieReleaseDates = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/movie/${data.id}/release_dates`,
			movieReleaseDatesSchema
		)
	);

export const fetchMovieReviews = createServerFn({ method: "GET" })
	.validator(movieIdPageInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/${data.id}/reviews`, reviewsSchema, {
			params: { language: data.language, page: data.page },
		})
	);

export const fetchMovieSimilar = createServerFn({ method: "GET" })
	.validator(movieIdPageInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/${data.id}/similar`, movieResultsSchema, {
			params: { language: data.language, page: data.page },
		})
	);

export const fetchMovieTranslations = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/movie/${data.id}/translations`,
			movieTranslationsSchema
		)
	);

export const fetchMovieVideos = createServerFn({ method: "GET" })
	.validator(movieIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/${data.id}/videos`, videoResultsSchema, {
			params: { language: data.language },
		})
	);

export const fetchMovieWatchProviders = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/movie/${data.id}/watch/providers`,
			movieWatchProvidersSchema
		)
	);

export const fetchMovieLatest = createServerFn({ method: "GET" })
	.validator(movieQueryParamsSchema.pick({ language: true }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/latest`, movieDetailSchema, {
			params: { language: data.language },
		})
	);

export const fetchNowPlayingMovies = createServerFn({ method: "GET" })
	.validator(movieQueryParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/now_playing`, movieNowPlayingResultsSchema, {
			params: { language: data.language, page: data.page, region: data.region },
		})
	);

export const fetchPopularMovies = createServerFn({ method: "GET" })
	.validator(movieQueryParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/popular`, movieResultsSchema, {
			params: {
				language: data.language,
				page: data.page,
				region: data.region,
			},
		})
	);

export const fetchTopRatedMovies = createServerFn({ method: "GET" })
	.validator(movieQueryParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/top_rated`, movieResultsSchema, {
			params: {
				language: data.language,
				page: data.page,
				region: data.region,
			},
		})
	);

export const fetchUpcomingMovies = createServerFn({ method: "GET" })
	.validator(movieQueryParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/movie/upcoming`, movieResultsSchema, {
			params: {
				language: data.language,
				page: data.page,
				region: data.region,
			},
		})
	);
