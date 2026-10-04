import { z } from "zod";

export const idSchema = z.number().int();
export const idSchemaOptional = z.number().int().optional();
export const nameSchema = z.string().min(1);
export const countrySchema = z.string().length(2);

export const genreSchema = z.object({
	id: idSchema,
	name: nameSchema,
});

export type Genre = z.infer<typeof genreSchema>;

export const productionCompanySchema = z.object({
	id: idSchema,
	logo_path: z.string().nullable(),
	name: nameSchema,
	origin_country: z.string().length(2),
});
export type ProductionCompany = z.infer<typeof productionCompanySchema>;

export const productionCountrySchema = z.object({
	iso_3166_1: countrySchema,
	name: nameSchema,
});
export type ProductionCountry = z.infer<typeof productionCountrySchema>;

export const spokenLanguageSchema = z.object({
	iso_639_1: z.string().length(2),
	english_name: z.string().min(1),
	name: nameSchema,
});
export type SpokenLanguage = z.infer<typeof spokenLanguageSchema>;

const creditSchema = z.object({
	id: idSchema,
	adult: z.boolean().default(false),
	gender: z.number().int().nullable(),
	known_for_department: z.string().min(1),
	name: nameSchema,
	original_name: z.string().min(1),
	popularity: z.number().nonnegative(),
	profile_path: z.string().nullable(),
	credit_id: z.string().min(1),
});

export const castSchema = creditSchema.extend({
	cast_id: idSchema,
	character: z.string().min(1),
	order: idSchema.nonnegative(),
});
export type Cast = z.infer<typeof castSchema>;

export const crewSchema = creditSchema.extend({
	department: z.string().min(1),
	job: z.string().min(1),
});
export type Crew = z.infer<typeof crewSchema>;

export const creditsSchema = z.object({
	cast: z.array(castSchema),
	crew: z.array(crewSchema),
});
export type Credits = z.infer<typeof creditsSchema>;

export const videoSchema = z.object({
	iso_639_1: z.string().length(2),
	iso_3166_1: z.string().length(2),
	name: nameSchema,
	key: z.string().min(1),
	site: z.string().min(1),
	size: z.number().int(),
	type: z.string().min(1),
	official: z.boolean(),
	published_at: z.iso.datetime(),
	id: idSchema,
});
export type Video = z.infer<typeof videoSchema>;

export const imageItemSchema = z.object({
	aspect_ratio: z.number().positive(),
	file_path: z.string().min(1),
	height: z.number().int().positive(),
	iso_639_1: z.string().length(2).nullable(),
	vote_average: z.number().nonnegative(),
	vote_count: z.number().nonnegative(),
	width: z.number().int().positive(),
});

export const imagesSchema = z.object({
	backdrops: z.array(imageItemSchema).optional(),
	logos: z.array(imageItemSchema).optional(),
	posters: z.array(imageItemSchema).optional(),
	profiles: z.array(imageItemSchema).optional(),
});

export const reviewAuthorDetailsSchema = z.object({
	name: nameSchema,
	username: z.string().min(1),
	avatar_path: z.string().nullable(),
	rating: z.number().int().nullable(),
});
export type ReviewAuthorDetails = z.infer<typeof reviewAuthorDetailsSchema>;

export const reviewSchema = z.object({
	author: z.string().min(1),
	author_details: reviewAuthorDetailsSchema,
	content: z.string().min(1),
	created_at: z.iso.datetime(),
	id: idSchema,
	updated_at: z.iso.datetime(),
	url: z.url(),
});

export const mediaTypeSchema = z.enum(["movie", "tv"]);
export type MediaType = z.infer<typeof mediaTypeSchema>;

export const networkSchema = z.object({
	id: idSchema,
	logo_path: z.string().nullable(),
	name: nameSchema,
	origin_country: countrySchema,
});
export type Network = z.infer<typeof networkSchema>;
