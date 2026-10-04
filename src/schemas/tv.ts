import { z } from "zod";

import { paginatedSchema } from "./aggreagate";
import {
	castSchema,
	crewSchema,
	genreSchema,
	idSchema,
	networkSchema,
    productionCompanySchema,
    spokenLanguageSchema,
} from "./common";

export const tvQueryParamsSchema = z.object({
	language: z.string().length(2).optional(),
	page: z.number().int().positive().optional(),
	timezone: z.string().optional(),
});
export type TVQueryParams = z.infer<typeof tvQueryParamsSchema>;

export const tvSeriesSchema = z.object({
	adult: z.boolean().default(false),
	backdrop_path: z.string().nullable(),
	first_air_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
	genre_ids: z.array(z.number().int().positive()),
	id: idSchema,
	name: z.string().min(1),
	origin_country: z.array(z.string().length(2)),
	original_language: z.string().length(2),
	original_name: z.string().min(1),
	overview: z.string(),
	popularity: z.number().nonnegative(),
	poster_path: z.string().nullable(),
	softcore: z.boolean(),
	vote_average: z.number().nonnegative(),
	vote_count: z.number().int().nonnegative(),
});
export type TVSeries = z.infer<typeof tvSeriesSchema>;

export const tvSeriesResultsSchema = paginatedSchema(tvSeriesSchema);
export type TVSeriesResults = z.infer<typeof tvSeriesResultsSchema>;

export const episodeSchema = z.object({
	air_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
	episode_number: z.number().int().nonnegative(),
	id: idSchema,
	name: z.string().min(1),
	overview: z.string(),
	production_code: z.string().optional(),
	runtime: z.number().int().nonnegative().optional(),
	season_number: z.number().int().nonnegative(),
	show_id: idSchema,
	still_path: z.string().nullable(),
	vote_average: z.number().nonnegative(),
	vote_count: z.number().int().nonnegative(),
});
export type Episode = z.infer<typeof episodeSchema>;

export const episodeDetailsSchema = episodeSchema.extend({
	crew: z.array(crewSchema),
	episode_type: z.string(),
	guest_stars: z.array(castSchema.omit({ cast_id: true })),
});
export type EpisodeDetails = z.infer<typeof episodeDetailsSchema>;

export const seasonDetailsSchema = z.object({
	_id: z.string(),
	air_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
	episodes: z.array(episodeDetailsSchema),
	id: idSchema,
	name: z.string().min(1),
	newtworks: z.array(networkSchema),
	overview: z.string(),
	poster_path: z.string().nullable(),
	season_number: z.number().int().nonnegative(),
	vote_average: z.number().nonnegative(),
});
export type Season = z.infer<typeof seasonDetailsSchema>;

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
	first_air_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
	genres: z.array(genreSchema),
    homepage: z.url().nullable(),
    id: idSchema,
    in_production: z.boolean().default(true),
    languages: z.array(z.string().length(2)),
    last_air_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
    last_episode_to_air: episodeSchema,
    name: z.string().min(1),
    next_episode_to_air: episodeSchema.nullable(),
    networks: z.array(networkSchema),
    number_of_episodes: z.number().int().nonnegative(),
    number_of_seasons: z.number().int().nonnegative(),
    origin_country: z.array(z.string().length(2)),
    original_language: z.string().length(2),
    original_name: z.string().min(1),
    overview: z.string(),
    popularity: z.number().nonnegative().optional(),
    poster_path: z.string().nullable(),
    production_companies: z.array(productionCompanySchema).optional(),
    seasons: z.array(seasonDetailsSchema),
    spoken_languages: z.array(spokenLanguageSchema).optional(),
    status: z.string().optional(),
    tagline: z.string().min(1).nullable(),
    type: z.string().min(1),
    vote_average: z.number().nonnegative(),
});
export type TVSeriesDetails = z.infer<typeof TVSeriesDetailsSchema>;
