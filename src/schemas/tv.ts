import { z } from "zod";

import {
	imageResultsSchema,
	paginatedSchema,
	reviewsSchema,
	videoResultsSchema,
} from "./aggregate";
import {
	castSchema,
	creditsSchema,
	crewSchema,
	genreSchema,
	idSchema,
	networkSchema,
	nullableDateOrEmptySchema,
	productionCompanySchema,
	productionCountrySchema,
	spokenLanguageSchema,
	appendToResponseParamSchema,
} from "./common";

export const tvQueryParamsSchema = z.object({
	language: z.string().min(2).optional(),
	page: z.number().int().positive().optional(),
	timezone: z.string().optional(),
});
export type TVQueryParams = z.infer<typeof tvQueryParamsSchema>;

export const tvSeriesSchema = z.object({
	adult: z.boolean().default(false),
	backdrop_path: z.string().nullable(),
	first_air_date: nullableDateOrEmptySchema,
	genre_ids: z.array(z.number().int().positive()),
	id: idSchema,
	name: z.string().min(1),
	origin_country: z.array(z.string()),
	original_language: z.string().min(1),
	original_name: z.string().min(1),
	overview: z.string(),
	popularity: z.number().nonnegative(),
	poster_path: z.string().nullable(),
	softcore: z.boolean().default(false),
	vote_average: z.number().nonnegative(),
	vote_count: z.number().int().nonnegative(),
});
export type TVSeries = z.infer<typeof tvSeriesSchema>;

export const tvSeriesResultsSchema = paginatedSchema(tvSeriesSchema);
export type TVSeriesResults = z.infer<typeof tvSeriesResultsSchema>;

export const episodeSchema = z.object({
	air_date: nullableDateOrEmptySchema,
	episode_number: z.number().int().nonnegative(),
	id: idSchema,
	name: z.string(),
	overview: z.string(),
	production_code: z.string().nullable().optional(),
	runtime: z.number().int().nonnegative().nullable().optional(),
	season_number: z.number().int().nonnegative(),
	show_id: idSchema,
	still_path: z.string().nullable(),
	vote_average: z.number().nonnegative(),
	vote_count: z.number().int().nonnegative(),
});
export type Episode = z.infer<typeof episodeSchema>;

const episodeGuestStarSchema = castSchema
	.omit({ cast_id: true })
	.partial()
	.required({ credit_id: true, id: true });

const episodeCrewSchema = crewSchema
	.partial()
	.required({ credit_id: true, id: true });

export const episodeDetailsSchema = episodeSchema.extend({
	crew: z.array(episodeCrewSchema),
	episode_type: z.string(),
	guest_stars: z.array(episodeGuestStarSchema),
});
export type EpisodeDetails = z.infer<typeof episodeDetailsSchema>;

export const seasonDetailsSchema = z.object({
	_id: z.string().optional(),
	air_date: nullableDateOrEmptySchema,
	episodes: z.array(episodeDetailsSchema),
	id: idSchema,
	name: z.string(),
	networks: z.array(networkSchema),
	overview: z.string(),
	poster_path: z.string().nullable(),
	season_number: z.number().int().nonnegative(),
	vote_average: z.number().nonnegative(),
});
export type Season = z.infer<typeof seasonDetailsSchema>;

export const seasonSummarySchema = z.object({
	air_date: nullableDateOrEmptySchema,
	episode_count: z.number().int().nonnegative(),
	id: idSchema,
	name: z.string(),
	overview: z.string(),
	poster_path: z.string().nullable(),
	season_number: z.number().int().nonnegative(),
	vote_average: z.number().nonnegative(),
});
export type SeasonSummary = z.infer<typeof seasonSummarySchema>;

export const TVSeriesDetailsSchema = z.object({
	adult: z.boolean().default(false),
	backdrop_path: z.string().nullable(),
	created_by: z.array(
		z.object({
			id: idSchema,
			credit_id: z.string().min(1),
			name: z.string().min(1),
			gender: z.number().int().nullable(),
			profile_path: z.string().nullable(),
		})
	),
	episode_run_time: z.array(z.number().int().nonnegative()),
	first_air_date: nullableDateOrEmptySchema,
	genres: z.array(genreSchema),
	homepage: z.union([z.url(), z.literal(""), z.null()]),
	id: idSchema,
	in_production: z.boolean().default(true),
	languages: z.array(z.string()),
	last_air_date: nullableDateOrEmptySchema,
	last_episode_to_air: episodeSchema.nullable(),
	name: z.string().min(1),
	next_episode_to_air: episodeSchema.nullable(),
	networks: z.array(networkSchema),
	number_of_episodes: z.number().int().nonnegative(),
	number_of_seasons: z.number().int().nonnegative(),
	origin_country: z.array(z.string()),
	original_language: z.string().min(1),
	original_name: z.string().min(1),
	overview: z.string(),
	popularity: z.number().nonnegative().optional(),
	poster_path: z.string().nullable(),
	production_companies: z.array(productionCompanySchema).optional(),
	production_countries: z.array(productionCountrySchema).optional(),
	seasons: z.array(seasonSummarySchema),
	softcore: z.boolean().default(false),
	spoken_languages: z.array(spokenLanguageSchema).optional(),
	status: z.string().optional(),
	tagline: z.string().nullable(),
	type: z.string(),
	vote_average: z.number().nonnegative(),
	vote_count: z.number().int().nonnegative().optional(),
});
export type TVSeriesDetails = z.infer<typeof TVSeriesDetailsSchema>;

export const tvSeriesAppendToResponseSchema = z.enum([
	"account_states",
	"aggregate_credits",
	"alternative_titles",
	"changes",
	"content_ratings",
	"credits",
	"episode_groups",
	"external_ids",
	"images",
	"keywords",
	"lists",
	"recommendations",
	"reviews",
	"screened_theatrically",
	"similar",
	"translations",
	"videos",
	"watch/providers",
]);
export type TVSeriesAppendToResponseNamespace = z.infer<
	typeof tvSeriesAppendToResponseSchema
>;

export const tvSeriesDetailsQueryParamsSchema = tvQueryParamsSchema.extend({
	append_to_response: appendToResponseParamSchema(
		tvSeriesAppendToResponseSchema
	).optional(),
});
export type TVSeriesDetailsQueryParams = z.infer<
	typeof tvSeriesDetailsQueryParamsSchema
>;

export const buildTvAppendToResponse = (
	namespaces: TVSeriesAppendToResponseNamespace[]
): string | undefined =>
	namespaces.length === 0 ? undefined : namespaces.join(",");

// Appended namespaces listed below are validated. Other supported
// namespaces must be valid JSON and pass through preserved.
export const tvSeriesDetailsWithAppendSchema = TVSeriesDetailsSchema.extend({
	credits: creditsSchema.optional(),
	images: imageResultsSchema.optional(),
	videos: videoResultsSchema.optional(),
	reviews: reviewsSchema.optional(),
	similar: tvSeriesResultsSchema.optional(),
	recommendations: tvSeriesResultsSchema.optional(),
}).catchall(z.json());
export type TVSeriesDetailsWithAppend = z.infer<
	typeof tvSeriesDetailsWithAppendSchema
>;
