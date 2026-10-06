import { z } from "zod";

import {
	imageResultsSchema,
	paginatedSchema,
	reviewsSchema,
	videoResultsSchema,
} from "./aggregate";
import {
	castSchema,
	changesSchema,
	creditsSchema,
	crewSchema,
	genreSchema,
	idSchema,
	idSchemaOptional,
	networkSchema,
	nullableDateOrEmptySchema,
	productionCompanySchema,
	productionCountrySchema,
	spokenLanguageSchema,
	tmdbListsSchema,
	watchProvidersSchema,
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
	show_id: idSchema.optional(),
	still_path: z.string().nullable(),
	vote_average: z.number().nonnegative(),
	vote_count: z.number().int().nonnegative(),
});
export type Episode = z.infer<typeof episodeSchema>;

const episodeGuestStarSchema = castSchema
	.omit({ cast_id: true })
	.partial()
	.required({ credit_id: true, id: true });
export type EpisodeGuestStar = z.infer<typeof episodeGuestStarSchema>;

const episodeCrewSchema = crewSchema
	.partial()
	.required({ credit_id: true, id: true });
export type EpisodeCrew = z.infer<typeof episodeCrewSchema>;

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

export const tvCreditsSchema = z.object({
	cast: z.array(castSchema.omit({ cast_id: true })),
	crew: z.array(crewSchema),
	id: idSchemaOptional,
});
export type TvCredits = z.infer<typeof tvCreditsSchema>;

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

export const buildTvAppendToResponse = (
	namespaces: TVSeriesAppendToResponseNamespace[]
): string | undefined =>
	namespaces.length === 0 ? undefined : [...new Set(namespaces)].join(",");

// Appended namespaces listed below are validated. Other supported
// namespaces must be valid JSON and pass through preserved.
export const tvSeriesDetailsWithAppendSchema = TVSeriesDetailsSchema.extend({
	credits: tvCreditsSchema.optional(),
	images: imageResultsSchema.optional(),
	videos: videoResultsSchema.optional(),
	reviews: reviewsSchema.optional(),
	similar: tvSeriesResultsSchema.optional(),
	recommendations: tvSeriesResultsSchema.optional(),
}).catchall(z.json());
export type TVSeriesDetailsWithAppend = z.infer<
	typeof tvSeriesDetailsWithAppendSchema
>;

export const tvAlternativeTitlesSchema = z.object({
	id: idSchemaOptional,
	results: z.array(
		z.object({
			iso_3166_1: z.string(),
			title: z.string().optional(),
			name: z.string().optional(),
			type: z.string().optional(),
		})
	),
});
export type TvAlternativeTitles = z.infer<typeof tvAlternativeTitlesSchema>;

export const tvChangesSchema = changesSchema;
export type TvChanges = z.infer<typeof tvChangesSchema>;

export const tvContentRatingsSchema = z.object({
	id: idSchemaOptional,
	results: z.array(
		z.object({
			descriptors: z.array(z.string()).optional(),
			iso_3166_1: z.string(),
			rating: z.string(),
		})
	),
});
export type TvContentRatings = z.infer<typeof tvContentRatingsSchema>;

const aggregateRoleSchema = z.object({
	credit_id: z.string().min(1),
	character: z.string(),
	episode_count: z.number().int().nonnegative(),
});

const aggregateJobSchema = z.object({
	credit_id: z.string().min(1),
	job: z.string(),
	episode_count: z.number().int().nonnegative(),
});

export const tvAggregateCreditsSchema = z.object({
	id: idSchemaOptional,
	cast: z.array(
		z.object({
			adult: z.boolean().default(false).optional(),
			gender: z.number().int().nullable().optional(),
			id: idSchema,
			known_for_department: z.string().optional(),
			name: z.string().optional(),
			original_name: z.string().optional(),
			popularity: z.number().nonnegative().optional(),
			profile_path: z.string().nullable().optional(),
			roles: z.array(aggregateRoleSchema),
			total_episode_count: z.number().int().nonnegative(),
			order: z.number().int().nonnegative(),
		})
	),
	crew: z.array(
		z.object({
			adult: z.boolean().default(false).optional(),
			gender: z.number().int().nullable().optional(),
			id: idSchema,
			known_for_department: z.string().optional(),
			name: z.string().optional(),
			original_name: z.string().optional(),
			popularity: z.number().nonnegative().optional(),
			profile_path: z.string().nullable().optional(),
			jobs: z.array(aggregateJobSchema),
			total_episode_count: z.number().int().nonnegative(),
			department: z.string(),
		})
	),
});
export type TvAggregateCredits = z.infer<typeof tvAggregateCreditsSchema>;

export const tvEpisodeGroupsSchema = z.object({
	id: idSchemaOptional,
	results: z.array(
		z.object({
			description: z.string(),
			episode_count: z.number().int().nonnegative(),
			group_count: z.number().int().nonnegative(),
			id: z.string().min(1),
			name: z.string(),
			network: networkSchema.nullable(),
			type: z.number().int().nonnegative(),
		})
	),
});
export type TvEpisodeGroups = z.infer<typeof tvEpisodeGroupsSchema>;

const episodeGroupEpisodeSchema = z.object({
	air_date: nullableDateOrEmptySchema,
	episode_number: z.number().int().nonnegative(),
	id: idSchema,
	name: z.string(),
	overview: z.string(),
	production_code: z.string().nullable().optional(),
	runtime: z.number().int().nonnegative().nullable().optional(),
	season_number: z.number().int().nonnegative(),
	show_id: idSchema.optional(),
	still_path: z.string().nullable(),
	vote_average: z.number().nonnegative(),
	vote_count: z.number().int().nonnegative(),
	order: z.number().int().nonnegative(),
});

export const tvEpisodeGroupDetailsSchema = z.object({
	description: z.string(),
	episode_count: z.number().int().nonnegative().optional(),
	id: z.string().min(1),
	name: z.string(),
	network: networkSchema.nullable(),
	type: z.number().int().nonnegative(),
	groups: z.array(
		z.object({
			id: z.string().min(1),
			name: z.string(),
			order: z.number().int().nonnegative(),
			locked: z.boolean(),
			episodes: z.array(episodeGroupEpisodeSchema),
		})
	),
});
export type TvEpisodeGroupDetails = z.infer<typeof tvEpisodeGroupDetailsSchema>;

export const tvExternalIdsSchema = z.object({
	id: idSchemaOptional,
	imdb_id: z.string().nullable().optional(),
	freebase_mid: z.string().nullable().optional(),
	freebase_id: z.string().nullable().optional(),
	tvdb_id: z.number().int().nullable().optional(),
	tvrage_id: z.number().int().nullable().optional(),
	wikidata_id: z.string().nullable().optional(),
	facebook_id: z.string().nullable().optional(),
	instagram_id: z.string().nullable().optional(),
	twitter_id: z.string().nullable().optional(),
});
export type TvExternalIds = z.infer<typeof tvExternalIdsSchema>;

export const tvKeywordsSchema = z.object({
	id: idSchemaOptional,
	results: z.array(
		z.object({
			id: idSchema,
			name: z.string(),
		})
	),
});
export type TvKeywords = z.infer<typeof tvKeywordsSchema>;

export const tvScreenedTheatricallySchema = z.object({
	id: idSchemaOptional,
	results: z.array(
		z.object({
			id: idSchema,
			episode_number: z.number().int().nonnegative(),
			season_number: z.number().int().nonnegative(),
		})
	),
});
export type TvScreenedTheatrically = z.infer<
	typeof tvScreenedTheatricallySchema
>;

export const tvTranslationsSchema = z.object({
	id: idSchemaOptional,
	translations: z.array(
		z.object({
			iso_3166_1: z.string(),
			iso_639_1: z.string(),
			name: z.string(),
			english_name: z.string(),
			data: z.object({
				name: z.string().optional(),
				overview: z.string().optional(),
				homepage: z.string().nullable().optional(),
			}),
		})
	),
});
export type TvTranslations = z.infer<typeof tvTranslationsSchema>;

export const tvWatchProvidersSchema = watchProvidersSchema;
export type TvWatchProviders = z.infer<typeof tvWatchProvidersSchema>;

export const tvListsSchema = tmdbListsSchema;
export type TvLists = z.infer<typeof tvListsSchema>;

export const tvSeasonCreditsSchema = creditsSchema.extend({
	id: idSchemaOptional,
});
export type TvSeasonCredits = z.infer<typeof tvSeasonCreditsSchema>;

export const tvSeasonExternalIdsSchema = z.object({
	id: idSchemaOptional,
});
export type TvSeasonExternalIds = z.infer<typeof tvSeasonExternalIdsSchema>;

export const tvEpisodeCreditsSchema = z.object({
	id: idSchemaOptional,
	cast: z.array(episodeGuestStarSchema),
	crew: z.array(episodeCrewSchema),
	guest_stars: z.array(episodeGuestStarSchema),
});
export type TvEpisodeCredits = z.infer<typeof tvEpisodeCreditsSchema>;

export const tvEpisodeExternalIdsSchema = z.object({
	id: idSchemaOptional,
	imdb_id: z.string().nullable().optional(),
});
export type TvEpisodeExternalIds = z.infer<typeof tvEpisodeExternalIdsSchema>;
