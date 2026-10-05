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

export const appendToResponseParamSchema = (
	namespaceSchema: z.ZodType<string>,
	maxEntries = 20
) =>
	z
		.string()
		.min(1)
		.transform((value) =>
			value
				.split(",")
				.map((entry) => entry.trim())
				.join(",")
		)
		.refine(
			(value) => {
				const namespaces = value.split(",");
				return (
					namespaces.length <= maxEntries &&
					namespaces.every(
						(namespace) => namespaceSchema.safeParse(namespace).success
					)
				);
			},
			{ message: "Invalid append_to_response namespace" }
		);

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
