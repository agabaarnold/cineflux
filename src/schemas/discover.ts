import { z } from "zod";

import { movieResultsSchema } from "./movie";
import { tvSeriesResultsSchema } from "./tv";

export const discoverMovieSortBySchema = z.enum([
	"popularity.asc",
	"popularity.desc",
	"release_date.asc",
	"release_date.desc",
	"revenue.asc",
	"revenue.desc",
	"primary_release_date.asc",
	"primary_release_date.desc",
	"original_title.asc",
	"original_title.desc",
	"vote_average.asc",
	"vote_average.desc",
	"vote_count.asc",
	"vote_count.desc",
]);
export type DiscoverMovieSortBy = z.infer<typeof discoverMovieSortBySchema>;

export const discoverTvSortBySchema = z.enum([
	"popularity.asc",
	"popularity.desc",
	"first_air_date.asc",
	"first_air_date.desc",
	"vote_average.asc",
	"vote_average.desc",
	"vote_count.asc",
	"vote_count.desc",
]);
export type DiscoverTvSortBy = z.infer<typeof discoverTvSortBySchema>;

const yyyyMmDdSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u);

export const discoverMoviesParamsSchema = z.object({
	include_adult: z.boolean().optional(),
	include_video: z.boolean().optional(),
	language: z.string().min(2).optional(),
	page: z.number().int().positive().optional(),
	primary_release_year: z.number().int().optional(),
	region: z.string().optional(),
	"release_date.gte": yyyyMmDdSchema.optional(),
	"release_date.lte": yyyyMmDdSchema.optional(),
	sort_by: discoverMovieSortBySchema.optional(),
	"vote_average.gte": z.number().nonnegative().optional(),
	"vote_count.gte": z.number().nonnegative().optional(),
	with_companies: z.string().min(1).optional(),
	with_genres: z.string().min(1).optional(),
	with_keywords: z.string().min(1).optional(),
	with_original_language: z.string().min(1).optional(),
	year: z.number().int().optional(),
});
export type DiscoverMoviesParams = z.infer<typeof discoverMoviesParamsSchema>;

export const discoverTvParamsSchema = z.object({
	first_air_date_year: z.number().int().optional(),
	language: z.string().min(2).optional(),
	page: z.number().int().positive().optional(),
	sort_by: discoverTvSortBySchema.optional(),
	timezone: z.string().optional(),
	"vote_average.gte": z.number().nonnegative().optional(),
	"vote_count.gte": z.number().nonnegative().optional(),
	with_companies: z.string().min(1).optional(),
	with_genres: z.string().min(1).optional(),
	with_networks: z.string().min(1).optional(),
	with_original_language: z.string().min(1).optional(),
});
export type DiscoverTvParams = z.infer<typeof discoverTvParamsSchema>;

export const discoverMoviesResultsSchema = movieResultsSchema;
export type DiscoverMoviesResults = z.infer<typeof discoverMoviesResultsSchema>;

export const discoverTvResultsSchema = tvSeriesResultsSchema;
export type DiscoverTvResults = z.infer<typeof discoverTvResultsSchema>;
