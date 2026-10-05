import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	imageResultsSchema,
	reviewsSchema,
	videoResultsSchema,
} from "#/schemas/aggregate.ts";
import { idSchema } from "#/schemas/common.ts";
import {
	buildTvAppendToResponse,
	episodeDetailsSchema,
	seasonDetailsSchema,
	tvAggregateCreditsSchema,
	tvAlternativeTitlesSchema,
	tvSeriesAppendToResponseSchema,
	tvChangesSchema,
	tvContentRatingsSchema,
	tvCreditsSchema,
	tvEpisodeCreditsSchema,
	tvEpisodeExternalIdsSchema,
	tvEpisodeGroupDetailsSchema,
	tvEpisodeGroupsSchema,
	tvExternalIdsSchema,
	tvKeywordsSchema,
	tvListsSchema,
	tvQueryParamsSchema,
	tvScreenedTheatricallySchema,
	tvSeasonCreditsSchema,
	tvSeasonExternalIdsSchema,
	TVSeriesDetailsSchema,
	tvSeriesDetailsWithAppendSchema,
	tvSeriesResultsSchema,
	tvTranslationsSchema,
	tvWatchProvidersSchema,
} from "#/schemas/tv.ts";
import { tmdbFetchValidated } from "#/server/tmdb/client.ts";

const tvIdInputSchema = z.object({
	id: idSchema,
	language: z.string().min(2).optional(),
});

const tvIdPageInputSchema = tvIdInputSchema.extend({
	page: z.number().int().positive().optional(),
});

const seasonInputSchema = z.object({
	id: idSchema,
	language: z.string().min(2).optional(),
	season_number: z.number().int().nonnegative(),
});

const episodeInputSchema = seasonInputSchema.extend({
	episode_number: z.number().int().nonnegative(),
});

export const fetchTvSeriesDetails = createServerFn({ method: "GET" })
	.validator(
		tvIdInputSchema.extend({
			append_to_response: z
				.array(tvSeriesAppendToResponseSchema)
				.max(20)
				.optional(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}`, tvSeriesDetailsWithAppendSchema, {
			params: {
				append_to_response: buildTvAppendToResponse(
					data.append_to_response ?? []
				),
				language: data.language,
			},
		})
	);

export const fetchTvAggregateCredits = createServerFn({ method: "GET" })
	.validator(tvIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/aggregate_credits`,
			tvAggregateCreditsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvAlternativeTitles = createServerFn({ method: "GET" })
	.validator(tvIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/alternative_titles`,
			tvAlternativeTitlesSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvChanges = createServerFn({ method: "GET" })
	.validator(
		tvIdInputSchema.extend({
			end_date: z.string().optional(),
			start_date: z.string().optional(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/changes`, tvChangesSchema, {
			params: {
				end_date: data.end_date,
				start_date: data.start_date,
			},
		})
	);

export const fetchTvContentRatings = createServerFn({ method: "GET" })
	.validator(tvIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/content_ratings`,
			tvContentRatingsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvCredits = createServerFn({ method: "GET" })
	.validator(tvIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/credits`, tvCreditsSchema, {
			params: { language: data.language },
		})
	);

export const fetchTvEpisodeGroups = createServerFn({ method: "GET" })
	.validator(tvIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/episode_groups`, tvEpisodeGroupsSchema, {
			params: { language: data.language },
		})
	);

export const fetchTvEpisodeGroupDetails = createServerFn({ method: "GET" })
	.validator(
		z.object({
			id: z.string().min(1),
			language: z.string().min(2).optional(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/episode_group/${data.id}`,
			tvEpisodeGroupDetailsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvExternalIds = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/external_ids`, tvExternalIdsSchema)
	);

export const fetchTvImages = createServerFn({ method: "GET" })
	.validator(tvIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/images`, imageResultsSchema, {
			params: { language: data.language },
		})
	);

export const fetchTvKeywords = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/keywords`, tvKeywordsSchema)
	);

export const fetchTvLists = createServerFn({ method: "GET" })
	.validator(tvIdPageInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/lists`, tvListsSchema, {
			params: { language: data.language, page: data.page },
		})
	);

export const fetchTvRecommendations = createServerFn({ method: "GET" })
	.validator(tvIdPageInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/recommendations`,
			tvSeriesResultsSchema,
			{ params: { language: data.language, page: data.page } }
		)
	);

export const fetchTvReviews = createServerFn({ method: "GET" })
	.validator(tvIdPageInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/reviews`, reviewsSchema, {
			params: { language: data.language, page: data.page },
		})
	);

export const fetchTvScreenedTheatrically = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/screened_theatrically`,
			tvScreenedTheatricallySchema
		)
	);

export const fetchTvSimilar = createServerFn({ method: "GET" })
	.validator(tvIdPageInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/similar`, tvSeriesResultsSchema, {
			params: { language: data.language, page: data.page },
		})
	);

export const fetchTvTranslations = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/translations`, tvTranslationsSchema)
	);

export const fetchTvVideos = createServerFn({ method: "GET" })
	.validator(tvIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/videos`, videoResultsSchema, {
			params: { language: data.language },
		})
	);

export const fetchTvWatchProviders = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/${data.id}/watch/providers`, tvWatchProvidersSchema)
	);

export const fetchTvSeasonDetails = createServerFn({ method: "GET" })
	.validator(seasonInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}`,
			seasonDetailsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvSeasonCredits = createServerFn({ method: "GET" })
	.validator(seasonInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}/credits`,
			tvSeasonCreditsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvSeasonExternalIds = createServerFn({ method: "GET" })
	.validator(
		z.object({
			id: idSchema,
			season_number: z.number().int().nonnegative(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}/external_ids`,
			tvSeasonExternalIdsSchema
		)
	);

export const fetchTvSeasonImages = createServerFn({ method: "GET" })
	.validator(seasonInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}/images`,
			imageResultsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvSeasonTranslations = createServerFn({ method: "GET" })
	.validator(
		z.object({
			id: idSchema,
			season_number: z.number().int().nonnegative(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}/translations`,
			tvTranslationsSchema
		)
	);

export const fetchTvSeasonVideos = createServerFn({ method: "GET" })
	.validator(seasonInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}/videos`,
			videoResultsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvEpisodeDetails = createServerFn({ method: "GET" })
	.validator(episodeInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}/episode/${data.episode_number}`,
			episodeDetailsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvEpisodeCredits = createServerFn({ method: "GET" })
	.validator(episodeInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}/episode/${data.episode_number}/credits`,
			tvEpisodeCreditsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvEpisodeExternalIds = createServerFn({ method: "GET" })
	.validator(
		z.object({
			episode_number: z.number().int().nonnegative(),
			id: idSchema,
			season_number: z.number().int().nonnegative(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}/episode/${data.episode_number}/external_ids`,
			tvEpisodeExternalIdsSchema
		)
	);

export const fetchTvEpisodeImages = createServerFn({ method: "GET" })
	.validator(episodeInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}/episode/${data.episode_number}/images`,
			imageResultsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvEpisodeTranslations = createServerFn({ method: "GET" })
	.validator(
		z.object({
			episode_number: z.number().int().nonnegative(),
			id: idSchema,
			season_number: z.number().int().nonnegative(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}/episode/${data.episode_number}/translations`,
			tvTranslationsSchema
		)
	);

export const fetchTvEpisodeVideos = createServerFn({ method: "GET" })
	.validator(episodeInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/tv/${data.id}/season/${data.season_number}/episode/${data.episode_number}/videos`,
			videoResultsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchTvAiringToday = createServerFn({ method: "GET" })
	.validator(tvQueryParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/airing_today`, tvSeriesResultsSchema, {
			params: {
				language: data.language,
				page: data.page,
				timezone: data.timezone,
			},
		})
	);

export const fetchTvOnTheAir = createServerFn({ method: "GET" })
	.validator(tvQueryParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/on_the_air`, tvSeriesResultsSchema, {
			params: {
				language: data.language,
				page: data.page,
				timezone: data.timezone,
			},
		})
	);

export const fetchTvPopular = createServerFn({ method: "GET" })
	.validator(tvQueryParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/popular`, tvSeriesResultsSchema, {
			params: {
				language: data.language,
				page: data.page,
				timezone: data.timezone,
			},
		})
	);

export const fetchTvTopRated = createServerFn({ method: "GET" })
	.validator(tvQueryParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/top_rated`, tvSeriesResultsSchema, {
			params: {
				language: data.language,
				page: data.page,
				timezone: data.timezone,
			},
		})
	);

export const fetchTvLatest = createServerFn({ method: "GET" })
	.validator(tvQueryParamsSchema.pick({ language: true }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/tv/latest`, TVSeriesDetailsSchema, {
			params: { language: data.language },
		})
	);
