import { z } from "zod";

import { paginatedSchema } from "./aggregate";
import { mediaTypeSchema } from "./common";

export const trendingAllSchema = z.object({
	adult: z.boolean().default(false),
	backdrop_path: z.string().nullable(),
	id: z.number().int().positive(),
	media_type: mediaTypeSchema,
	original_language: z.string().min(1),
	original_title: z.string().min(1).optional(),
	overview: z.string(),
	popularity: z.number().nonnegative(),
	poster_path: z.string().nullable(),
	release_date: z
		.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/u), z.literal(""), z.null()])
		.optional(),
	title: z.string(),
	video: z.boolean().default(true),
	vote_average: z.number().nonnegative(),
	vote_count: z.number().int().nonnegative(),
});
export type TrendingAll = z.infer<typeof trendingAllSchema>;

export const trendingAllResultsSchema = paginatedSchema(trendingAllSchema);
export type TrendingAllResults = z.infer<typeof trendingAllResultsSchema>;

export const trendingMoviesSchema = trendingAllSchema.extend({
	media_type: z.literal("movie"),
});
export type TrendingMovies = z.infer<typeof trendingMoviesSchema>;

export const trendingMoviesResultsSchema =
	paginatedSchema(trendingMoviesSchema);
export type TrendingMoviesResults = z.infer<typeof trendingMoviesResultsSchema>;

export const trendingTVSchema = trendingAllSchema.extend({
	media_type: z.literal("tv"),
});
export type TrendingTV = z.infer<typeof trendingTVSchema>;

export const trendingTVResultsSchema = paginatedSchema(trendingTVSchema);
export type TrendingTVResults = z.infer<typeof trendingTVResultsSchema>;

export const trendingPeopleSchema = trendingAllSchema.extend({
	media_type: z.literal("person"),
});
export type TrendingPeople = z.infer<typeof trendingPeopleSchema>;

export const trendingPeopleResultsSchema =
	paginatedSchema(trendingPeopleSchema);
export type TrendingPeopleResults = z.infer<typeof trendingPeopleResultsSchema>;
