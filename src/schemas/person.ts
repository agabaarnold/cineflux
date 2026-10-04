import { z } from "zod";

import { paginatedSchema } from "./aggregate";
import { castSchema, crewSchema, idSchema } from "./common";

const dateOrEmpty = z.union([
	z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
	z.literal(""),
	z.null(),
]);

export const personQueryParamsSchema = z.object({
	language: z.string().min(2).optional(),
	page: z.number().int().positive().optional(),
});
export type PersonQueryParams = z.infer<typeof personQueryParamsSchema>;

export const knownForItemSchema = z.object({
	id: idSchema,
	media_type: z.enum(["movie", "tv"]),
	adult: z.boolean().default(false).optional(),
	backdrop_path: z.string().nullable().optional(),
	genre_ids: z.array(z.number().int().positive()).optional(),
	original_language: z.string().optional(),
	overview: z.string().optional(),
	popularity: z.number().nonnegative().optional(),
	poster_path: z.string().nullable().optional(),
	release_date: dateOrEmpty.optional(),
	first_air_date: dateOrEmpty.optional(),
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
	known_for_department: z.string(),
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
	birthday: dateOrEmpty.optional(),
	deathday: dateOrEmpty.optional(),
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
	release_date: dateOrEmpty.optional(),
	poster_path: z.string().nullable().optional(),
	backdrop_path: z.string().nullable().optional(),
	genre_ids: z.array(z.number().int().positive()).optional(),
	original_language: z.string().optional(),
	overview: z.string().optional(),
	popularity: z.number().nonnegative().optional(),
	video: z.boolean().optional(),
	vote_average: z.number().nonnegative().optional(),
	vote_count: z.number().int().nonnegative().optional(),
	media_type: z.enum(["movie", "tv"]).optional(),
	episode_count: z.number().int().nonnegative().optional(),
});

const personTvExtrasSchema = z.object({
	name: z.string().optional(),
	original_name: z.string().optional(),
	first_air_date: dateOrEmpty.optional(),
	poster_path: z.string().nullable().optional(),
	backdrop_path: z.string().nullable().optional(),
	genre_ids: z.array(z.number().int().positive()).optional(),
	origin_country: z.array(z.string()).optional(),
	original_language: z.string().optional(),
	overview: z.string().optional(),
	popularity: z.number().nonnegative().optional(),
	vote_average: z.number().nonnegative().optional(),
	vote_count: z.number().int().nonnegative().optional(),
	media_type: z.enum(["movie", "tv"]).optional(),
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

export const personCombinedCastSchema = castSchema
	.partial()
	.required({ credit_id: true, id: true })
	.extend({
		...personMovieExtrasSchema.shape,
		...personTvExtrasSchema.shape,
	});
export type PersonCombinedCast = z.infer<typeof personCombinedCastSchema>;

export const personCombinedCrewSchema = crewSchema
	.partial()
	.required({ credit_id: true, id: true })
	.extend({
		...personMovieExtrasSchema.shape,
		...personTvExtrasSchema.shape,
	});
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

export type PersonAppendToResponseNamespace =
	| "combined_credits"
	| "external_ids"
	| "images"
	| "movie_credits"
	| "tagged_images"
	| "translations"
	| "tv_credits";
