import { z } from "zod";

import { paginatedSchema } from "./aggregate";
import {
	countrySchema,
	genreSchema,
	idSchema,
	nameSchema,
	productionCompanySchema,
	productionCountrySchema,
	spokenLanguageSchema,
} from "./common";

export const movieQueryParamsSchema = z.object({
	language: z.string().min(2).optional(),
	page: z.number().int().positive().optional(),
	region: countrySchema.optional(),
});
export type MovieQueryParams = z.infer<typeof movieQueryParamsSchema>;

export const movieSchema = z.object({
	adult: z.boolean().default(false),
	backdrop_path: z.string().nullable(),
	genre_ids: z.array(z.number().int().positive()),
	id: idSchema,
	original_language: z.string().min(1),
	original_title: nameSchema,
	overview: z.string(),
	popularity: z.number().nonnegative(),
	poster_path: z.string().nullable(),
	release_date: z.union([
		z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
		z.literal(""),
	]),
	softcore: z.boolean().default(false),
	title: nameSchema,
	video: z.boolean(),
	vote_average: z.number().nonnegative(),
	vote_count: z.number().int().nonnegative(),
});
export type Movie = z.infer<typeof movieSchema>;

export const movieResultsSchema = paginatedSchema(movieSchema);
export type MovieResults = z.infer<typeof movieResultsSchema>;

export const movieNowPlayingResultsSchema = movieResultsSchema.extend({
	dates: z.object({
		maximum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
		minimum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
	}),
});
export type MovieNowPlayingResults = z.infer<
	typeof movieNowPlayingResultsSchema
>;

export const movieCollectionSchema = z.object({
	id: idSchema,
	name: nameSchema,
	poster_path: z.string().nullable(),
	backdrop_path: z.string().nullable(),
});
export type MovieCollection = z.infer<typeof movieCollectionSchema>;

export const movieDetailSchema = z.object({
	adult: z.boolean().default(false),
	backdrop_path: z.string().nullable(),
	belongs_to_collection: movieCollectionSchema.nullable(),
	budget: z.number().int().nonnegative().nullable(),
	genres: z.array(genreSchema),
	homepage: z.union([z.url(), z.literal(""), z.null()]),
	id: idSchema,
	imdb_id: z.string().nullable(),
	origin_country: z.array(z.string()),
	original_language: z.string().min(1),
	original_title: z.string().min(1),
	overview: z.string(),
	popularity: z.number().nonnegative(),
	poster_path: z.string().nullable(),
	production_companies: z.array(productionCompanySchema),
	production_countries: z.array(productionCountrySchema),
	release_date: z.union([
		z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
		z.literal(""),
	]),
	revenue: z.number().int().nonnegative().nullable(),
	runtime: z.number().int().nonnegative().nullable(),
	softcore: z.boolean().default(false),
	spoken_languages: z.array(spokenLanguageSchema).optional(),
	status: z.string().optional(),
	tagline: z.string().nullable(),
	title: z.string().min(1),
	video: z.boolean(),
	vote_average: z.number().nonnegative(),
	vote_count: z.number().int().nonnegative(),
});
export type MovieDetails = z.infer<typeof movieDetailSchema>;

export type MovieAppendToResponseNamespace =
	| "alternative_titles"
	| "changes"
	| "credits"
	| "external_ids"
	| "images"
	| "keywords"
	| "recommendations"
	| "release_dates"
	| "reviews"
	| "similar"
	| "translations"
	| "videos"
	| "watch/providers";
