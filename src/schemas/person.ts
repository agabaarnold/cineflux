import { z } from "zod";

import { imageResultsSchema, paginatedSchema } from "./aggregate";
import {
	castSchema,
	crewSchema,
	idSchema,
	idSchemaOptional,
	nullableDateOrEmptySchema,
	screenMediaTypeSchema,
} from "./common";

export const personQueryParamsSchema = z.object({
	language: z.string().min(2).optional(),
	page: z.number().int().positive().optional(),
});
export type PersonQueryParams = z.infer<typeof personQueryParamsSchema>;

export const knownForItemSchema = z.object({
	id: idSchema,
	media_type: screenMediaTypeSchema,
	adult: z.boolean().default(false),
	backdrop_path: z.string().nullable().optional(),
	genre_ids: z.array(z.number().int().positive()).optional(),
	original_language: z.string().optional(),
	overview: z.string().optional(),
	popularity: z.number().nonnegative().optional(),
	poster_path: z.string().nullable().optional(),
	release_date: nullableDateOrEmptySchema.optional(),
	first_air_date: nullableDateOrEmptySchema.optional(),
	title: z.string().optional(),
	name: z.string().optional(),
	original_title: z.string().optional(),
	original_name: z.string().optional(),
	video: z.boolean().optional(),
	vote_average: z.number().nonnegative().optional(),
	vote_count: z.number().int().nonnegative().optional(),
});
export type KnownForItem = z.infer<typeof knownForItemSchema>;

export const personSchema = z.object({
	adult: z.boolean().default(false),
	gender: z.number().int().nullable(),
	id: idSchema,
	known_for: z.array(knownForItemSchema).optional(),
	known_for_department: z.string().nullable(),
	name: z.string(),
	original_name: z.string(),
	popularity: z.number().nonnegative(),
	profile_path: z.string().nullable(),
});
export type Person = z.infer<typeof personSchema>;

export const personResultsSchema = paginatedSchema(personSchema);
export type PersonResults = z.infer<typeof personResultsSchema>;

export const personDetailsSchema = z.object({
	adult: z.boolean().default(false),
	also_known_as: z.array(z.string()),
	biography: z.string(),
	birthday: nullableDateOrEmptySchema.optional(),
	deathday: nullableDateOrEmptySchema.optional(),
	gender: z.number().int().nullable(),
	homepage: z.union([z.url(), z.literal(""), z.null()]).optional(),
	id: idSchema,
	imdb_id: z.string().nullable(),
	known_for_department: z.string(),
	name: z.string(),
	place_of_birth: z.string().nullable(),
	popularity: z.number().nonnegative(),
	profile_path: z.string().nullable(),
});
export type PersonDetails = z.infer<typeof personDetailsSchema>;

const personMovieExtrasSchema = z.object({
	title: z.string().optional(),
	original_title: z.string().optional(),
	release_date: nullableDateOrEmptySchema.optional(),
	poster_path: z.string().nullable().optional(),
	backdrop_path: z.string().nullable().optional(),
	genre_ids: z.array(z.number().int().positive()).optional(),
	original_language: z.string().optional(),
	overview: z.string().optional(),
	popularity: z.number().nonnegative().optional(),
	video: z.boolean().optional(),
	vote_average: z.number().nonnegative().optional(),
	vote_count: z.number().int().nonnegative().optional(),
	media_type: screenMediaTypeSchema.optional(),
});

const personTvExtrasSchema = z.object({
	name: z.string().optional(),
	original_name: z.string().optional(),
	first_air_date: nullableDateOrEmptySchema.optional(),
	poster_path: z.string().nullable().optional(),
	backdrop_path: z.string().nullable().optional(),
	genre_ids: z.array(z.number().int().positive()).optional(),
	origin_country: z.array(z.string()).optional(),
	original_language: z.string().optional(),
	overview: z.string().optional(),
	popularity: z.number().nonnegative().optional(),
	vote_average: z.number().nonnegative().optional(),
	vote_count: z.number().int().nonnegative().optional(),
	media_type: screenMediaTypeSchema.optional(),
	episode_count: z.number().int().nonnegative().optional(),
});

export const personMovieCastSchema = castSchema
	.partial()
	.required({ credit_id: true, id: true })
	.extend(personMovieExtrasSchema.shape);
export type PersonMovieCast = z.infer<typeof personMovieCastSchema>;

export const personMovieCrewSchema = crewSchema
	.partial()
	.required({ credit_id: true, id: true })
	.extend(personMovieExtrasSchema.shape);
export type PersonMovieCrew = z.infer<typeof personMovieCrewSchema>;

export const personTvCastSchema = castSchema
	.partial()
	.required({ credit_id: true, id: true })
	.extend(personTvExtrasSchema.shape);
export type PersonTvCast = z.infer<typeof personTvCastSchema>;

export const personTvCrewSchema = crewSchema
	.partial()
	.required({ credit_id: true, id: true })
	.extend(personTvExtrasSchema.shape);
export type PersonTvCrew = z.infer<typeof personTvCrewSchema>;

const personCombinedMovieCastSchema = personMovieCastSchema.extend({
	media_type: z.literal("movie"),
});

const personCombinedTvCastSchema = personTvCastSchema.extend({
	media_type: z.literal("tv"),
});

export const personCombinedCastSchema = z.discriminatedUnion("media_type", [
	personCombinedMovieCastSchema,
	personCombinedTvCastSchema,
]);
export type PersonCombinedCast = z.infer<typeof personCombinedCastSchema>;

const personCombinedMovieCrewSchema = personMovieCrewSchema.extend({
	media_type: z.literal("movie"),
});

const personCombinedTvCrewSchema = personTvCrewSchema.extend({
	media_type: z.literal("tv"),
});

export const personCombinedCrewSchema = z.discriminatedUnion("media_type", [
	personCombinedMovieCrewSchema,
	personCombinedTvCrewSchema,
]);
export type PersonCombinedCrew = z.infer<typeof personCombinedCrewSchema>;

export const personMovieCreditsSchema = z.object({
	id: idSchema.optional(),
	cast: z.array(personMovieCastSchema),
	crew: z.array(personMovieCrewSchema),
});
export type PersonMovieCredits = z.infer<typeof personMovieCreditsSchema>;

export const personTvCreditsSchema = z.object({
	id: idSchema.optional(),
	cast: z.array(personTvCastSchema),
	crew: z.array(personTvCrewSchema),
});
export type PersonTvCredits = z.infer<typeof personTvCreditsSchema>;

export const personCombinedCreditsSchema = z.object({
	id: idSchema.optional(),
	cast: z.array(personCombinedCastSchema),
	crew: z.array(personCombinedCrewSchema),
});
export type PersonCombinedCredits = z.infer<typeof personCombinedCreditsSchema>;

export const personExternalIdsSchema = z.object({
	id: idSchema.optional(),
	imdb_id: z.string().nullable().optional(),
	wikidata_id: z.string().nullable().optional(),
	facebook_id: z.string().nullable().optional(),
	instagram_id: z.string().nullable().optional(),
	tiktok_id: z.string().nullable().optional(),
	twitter_id: z.string().nullable().optional(),
	youtube_id: z.string().nullable().optional(),
});
export type PersonExternalIds = z.infer<typeof personExternalIdsSchema>;

export const personAppendToResponseSchema = z.enum([
	"combined_credits",
	"external_ids",
	"images",
	"movie_credits",
	"tagged_images",
	"translations",
	"tv_credits",
]);
export type PersonAppendToResponseNamespace = z.infer<
	typeof personAppendToResponseSchema
>;

export const buildPersonAppendToResponse = (
	namespaces: PersonAppendToResponseNamespace[]
): string | undefined =>
	namespaces.length === 0 ? undefined : [...new Set(namespaces)].join(",");

// Appended namespaces listed below are validated. Other supported
// namespaces must be valid JSON and pass through preserved.
export const personDetailsWithAppendSchema = personDetailsSchema
	.extend({
		movie_credits: personMovieCreditsSchema.optional(),
		tv_credits: personTvCreditsSchema.optional(),
		combined_credits: personCombinedCreditsSchema.optional(),
		external_ids: personExternalIdsSchema.optional(),
		images: imageResultsSchema.optional(),
	})
	.catchall(z.json());
export type PersonDetailsWithAppend = z.infer<
	typeof personDetailsWithAppendSchema
>;

export const personTaggedImagesSchema = z.object({
	id: idSchemaOptional,
	page: z.number().int().positive().optional(),
	results: z.array(
		z.object({
			aspect_ratio: z.number().positive(),
			file_path: z.string().min(1),
			height: z.number().int().positive(),
			id: idSchema.optional(),
			iso_639_1: z.string().nullable(),
			media: z
				.object({
					id: idSchema,
					media_type: screenMediaTypeSchema,
				})
				.catchall(z.json()),
			media_type: screenMediaTypeSchema,
			vote_average: z.number().nonnegative(),
			vote_count: z.number().nonnegative(),
			width: z.number().int().positive(),
		})
	),
	total_pages: z.number().int().nonnegative().optional(),
	total_results: z.number().int().nonnegative().optional(),
});
export type PersonTaggedImages = z.infer<typeof personTaggedImagesSchema>;

export const personTranslationsSchema = z.object({
	id: idSchemaOptional,
	translations: z.array(
		z.object({
			iso_3166_1: z.string(),
			iso_639_1: z.string(),
			name: z.string(),
			english_name: z.string(),
			data: z.object({
				biography: z.string().optional(),
			}),
		})
	),
});
export type PersonTranslations = z.infer<typeof personTranslationsSchema>;
