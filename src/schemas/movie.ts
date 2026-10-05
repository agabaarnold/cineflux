import { z } from "zod";

import {
	imageResultsSchema,
	paginatedSchema,
	reviewsSchema,
	videoResultsSchema,
} from "./aggregate";
import {
	changesSchema,
	countrySchema,
	creditsSchema,
	dateOrEmptySchema,
	genreSchema,
	idSchema,
	idSchemaOptional,
	nameSchema,
	productionCompanySchema,
	productionCountrySchema,
	spokenLanguageSchema,
	tmdbListsSchema,
	watchProvidersSchema,
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
	release_date: dateOrEmptySchema,
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
	release_date: dateOrEmptySchema,
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

export const movieAppendToResponseSchema = z.enum([
	"account_states",
	"alternative_titles",
	"changes",
	"credits",
	"external_ids",
	"images",
	"keywords",
	"lists",
	"recommendations",
	"release_dates",
	"reviews",
	"similar",
	"translations",
	"videos",
	"watch/providers",
]);
export type MovieAppendToResponseNamespace = z.infer<
	typeof movieAppendToResponseSchema
>;

export const buildMovieAppendToResponse = (
	namespaces: MovieAppendToResponseNamespace[]
): string | undefined =>
	namespaces.length === 0 ? undefined : [...new Set(namespaces)].join(",");

// Appended namespaces listed below are validated. Other supported
// namespaces must be valid JSON and pass through preserved.
export const movieDetailsWithAppendSchema = movieDetailSchema
	.extend({
		credits: creditsSchema.optional(),
		images: imageResultsSchema.optional(),
		videos: videoResultsSchema.optional(),
		reviews: reviewsSchema.optional(),
		similar: movieResultsSchema.optional(),
		recommendations: movieResultsSchema.optional(),
	})
	.catchall(z.json());
export type MovieDetailsWithAppend = z.infer<
	typeof movieDetailsWithAppendSchema
>;

export const movieAlternativeTitlesSchema = z.object({
	id: idSchemaOptional,
	titles: z.array(
		z.object({
			iso_3166_1: z.string(),
			title: z.string(),
			type: z.string().optional(),
		})
	),
});
export type MovieAlternativeTitles = z.infer<
	typeof movieAlternativeTitlesSchema
>;

export const movieChangesSchema = changesSchema;
export type MovieChanges = z.infer<typeof movieChangesSchema>;

export const movieCreditsSchema = creditsSchema.extend({
	id: idSchemaOptional,
});
export type MovieCredits = z.infer<typeof movieCreditsSchema>;

export const movieExternalIdsSchema = z.object({
	id: idSchemaOptional,
	imdb_id: z.string().nullable().optional(),
	wikidata_id: z.string().nullable().optional(),
	facebook_id: z.string().nullable().optional(),
	instagram_id: z.string().nullable().optional(),
	twitter_id: z.string().nullable().optional(),
});
export type MovieExternalIds = z.infer<typeof movieExternalIdsSchema>;

export const movieKeywordsSchema = z.object({
	id: idSchemaOptional,
	keywords: z.array(
		z.object({
			id: idSchema,
			name: z.string(),
		})
	),
});
export type MovieKeywords = z.infer<typeof movieKeywordsSchema>;

export const movieReleaseDatesSchema = z.object({
	id: idSchemaOptional,
	results: z.array(
		z.object({
			iso_3166_1: z.string(),
			release_dates: z.array(
				z.object({
					certification: z.string(),
					descriptors: z.array(z.string()),
					iso_639_1: z.string(),
					note: z.string(),
					release_date: z.iso.datetime(),
					type: z.number().int().nonnegative(),
				})
			),
		})
	),
});
export type MovieReleaseDates = z.infer<typeof movieReleaseDatesSchema>;

export const movieTranslationsSchema = z.object({
	id: idSchemaOptional,
	translations: z.array(
		z.object({
			iso_3166_1: z.string(),
			iso_639_1: z.string(),
			name: z.string(),
			english_name: z.string(),
			data: z.object({
				title: z.string().optional(),
				overview: z.string().optional(),
				homepage: z.string().nullable().optional(),
				runtime: z.number().int().nonnegative().nullable().optional(),
				tagline: z.string().nullable().optional(),
			}),
		})
	),
});
export type MovieTranslations = z.infer<typeof movieTranslationsSchema>;

export const movieWatchProvidersSchema = watchProvidersSchema;
export type MovieWatchProviders = z.infer<typeof movieWatchProvidersSchema>;

export const movieListsSchema = tmdbListsSchema;
export type MovieLists = z.infer<typeof movieListsSchema>;
