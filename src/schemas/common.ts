import { z } from "zod";

export const idSchema = z.number().int();
export const idSchemaOptional = z.number().int().optional();
export const nameSchema = z.string().min(1);
export const countrySchema = z.string().length(2);

const tmdbDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u);

export const dateOrEmptySchema = z.union([tmdbDateSchema, z.literal("")]);

export const nullableDateOrEmptySchema = z.union([
	tmdbDateSchema,
	z.literal(""),
	z.null(),
]);

export const screenMediaTypeSchema = z.enum(["movie", "tv"]);

export const genreSchema = z.object({
	id: idSchema,
	name: nameSchema,
});

export type Genre = z.infer<typeof genreSchema>;

export const productionCompanySchema = z.object({
	id: idSchema,
	logo_path: z.string().nullable(),
	name: z.string(),
	origin_country: z.string(),
});
export type ProductionCompany = z.infer<typeof productionCompanySchema>;

export const productionCountrySchema = z.object({
	iso_3166_1: countrySchema,
	name: nameSchema,
});
export type ProductionCountry = z.infer<typeof productionCountrySchema>;

export const spokenLanguageSchema = z.object({
	iso_639_1: z.string(),
	english_name: z.string(),
	name: z.string(),
});
export type SpokenLanguage = z.infer<typeof spokenLanguageSchema>;

const creditSchema = z.object({
	id: idSchema,
	adult: z.boolean().default(false),
	gender: z.number().int().nullable(),
	known_for_department: z.string(),
	name: z.string(),
	original_name: z.string(),
	popularity: z.number().nonnegative(),
	profile_path: z.string().nullable(),
	credit_id: z.string().min(1),
});

export const castSchema = creditSchema.extend({
	cast_id: idSchema,
	character: z.string(),
	order: idSchema.nonnegative(),
});
export type Cast = z.infer<typeof castSchema>;

export const crewSchema = creditSchema.extend({
	department: z.string(),
	job: z.string(),
});
export type Crew = z.infer<typeof crewSchema>;

export const creditsSchema = z.object({
	cast: z.array(castSchema),
	crew: z.array(crewSchema),
});
export type Credits = z.infer<typeof creditsSchema>;

export const videoSchema = z.object({
	iso_639_1: z.string(),
	iso_3166_1: z.string(),
	name: z.string(),
	key: z.string().min(1),
	site: z.string(),
	size: z.number().int().nonnegative(),
	type: z.string(),
	official: z.boolean(),
	published_at: z.iso.datetime(),
	id: z.string().min(1),
});
export type Video = z.infer<typeof videoSchema>;

export const imageItemSchema = z.object({
	aspect_ratio: z.number().positive(),
	file_path: z.string().min(1),
	height: z.number().int().positive(),
	iso_639_1: z.string().nullable(),
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
	name: z.string(),
	username: z.string(),
	avatar_path: z.string().nullable(),
	rating: z.number().nullable(),
});
export type ReviewAuthorDetails = z.infer<typeof reviewAuthorDetailsSchema>;

export const reviewSchema = z.object({
	author: z.string(),
	author_details: reviewAuthorDetailsSchema,
	content: z.string(),
	created_at: z.iso.datetime(),
	id: z.string().min(1),
	updated_at: z.iso.datetime(),
	url: z.url(),
});

export const mediaTypeSchema = z.enum(["movie", "tv", "person"]);
export type MediaType = z.infer<typeof mediaTypeSchema>;

export const timeWindowSchema = z.enum(["day", "week"]);
export type TimeWindow = z.infer<typeof timeWindowSchema>;

export const networkSchema = z.object({
	id: idSchema,
	logo_path: z.string().nullable(),
	name: z.string(),
	origin_country: z.string(),
});
export type Network = z.infer<typeof networkSchema>;

export const changeItemSchema = z.object({
	id: z.union([z.number().int(), z.string().min(1)]),
	action: z.string(),
	time: z.string(),
	iso_639_1: z.string().optional(),
	iso_3166_1: z.string().optional(),
	value: z.json().optional(),
});
export type ChangeItem = z.infer<typeof changeItemSchema>;

export const changesSchema = z.object({
	changes: z.array(
		z.object({
			key: z.string(),
			items: z.array(changeItemSchema),
		})
	),
});
export type Changes = z.infer<typeof changesSchema>;

export const watchProviderSchema = z.object({
	logo_path: z.string().nullable().optional(),
	provider_id: idSchema,
	provider_name: z.string(),
	display_priority: z.number().int().nonnegative(),
});
export type WatchProvider = z.infer<typeof watchProviderSchema>;

export const watchProviderRegionSchema = z.object({
	link: z.string().optional(),
	flatrate: z.array(watchProviderSchema).optional(),
	rent: z.array(watchProviderSchema).optional(),
	buy: z.array(watchProviderSchema).optional(),
	free: z.array(watchProviderSchema).optional(),
	ads: z.array(watchProviderSchema).optional(),
});
export type WatchProviderRegion = z.infer<typeof watchProviderRegionSchema>;

export const watchProvidersSchema = z.object({
	id: idSchemaOptional,
	results: z.record(z.string(), watchProviderRegionSchema),
});
export type WatchProviders = z.infer<typeof watchProvidersSchema>;

export const tmdbListSummarySchema = z.object({
	description: z.string(),
	favorite_count: z.number().int().nonnegative(),
	id: z.union([z.number().int(), z.string().min(1)]),
	item_count: z.number().int().nonnegative(),
	iso_639_1: z.string().optional(),
	iso_3166_1: z.string().optional(),
	list_type: z.string().optional(),
	name: z.string(),
	poster_path: z.string().nullable(),
});
export type TmdbListSummary = z.infer<typeof tmdbListSummarySchema>;

export const tmdbListsSchema = z.object({
	page: z.number().int().positive(),
	results: z.array(tmdbListSummarySchema),
	total_pages: z.number().int().nonnegative(),
	total_results: z.number().int().nonnegative(),
});
export type TmdbLists = z.infer<typeof tmdbListsSchema>;
