import { z } from "zod";

import { idSchema, networkSchema } from "./common";
import { movieSchema } from "./movie";

export const genreListSchema = z.object({
	genres: z.array(
		z.object({
			id: idSchema,
			name: z.string(),
		})
	),
});
export type GenreList = z.infer<typeof genreListSchema>;

export const configurationSchema = z.object({
	change_keys: z.array(z.string()),
	images: z.object({
		backdrop_sizes: z.array(z.string()),
		base_url: z.url(),
		logo_sizes: z.array(z.string()),
		poster_sizes: z.array(z.string()),
		profile_sizes: z.array(z.string()),
		secure_base_url: z.url(),
		still_sizes: z.array(z.string()),
	}),
});
export type Configuration = z.infer<typeof configurationSchema>;

export const collectionDetailsSchema = z.object({
	backdrop_path: z.string().nullable(),
	id: idSchema,
	name: z.string(),
	overview: z.string(),
	parts: z.array(movieSchema.partial({ genre_ids: true, video: true })),
	poster_path: z.string().nullable(),
});
export type CollectionDetails = z.infer<typeof collectionDetailsSchema>;

export const companyDetailsSchema = z.object({
	description: z.string(),
	headquarters: z.string(),
	homepage: z.union([z.url(), z.literal(""), z.null()]),
	id: idSchema,
	logo_path: z.string().nullable(),
	name: z.string(),
	origin_country: z.string(),
	parent_company: z
		.object({
			id: idSchema,
			logo_path: z.string().nullable(),
			name: z.string(),
		})
		.nullable(),
});
export type CompanyDetails = z.infer<typeof companyDetailsSchema>;

export const alternativeNamesSchema = z.object({
	id: idSchema.optional(),
	results: z.array(
		z.object({
			name: z.string(),
			type: z.string().optional(),
		})
	),
});
export type AlternativeNames = z.infer<typeof alternativeNamesSchema>;

export const networkDetailsSchema = networkSchema.extend({
	headquarters: z.string(),
	homepage: z.union([z.url(), z.literal(""), z.null()]),
});
export type NetworkDetails = z.infer<typeof networkDetailsSchema>;

export const keywordDetailsSchema = z.object({
	id: idSchema,
	name: z.string(),
});
export type KeywordDetails = z.infer<typeof keywordDetailsSchema>;
