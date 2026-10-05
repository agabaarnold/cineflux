import { z } from "zod";

import { paginatedSchema } from "./aggregate";
import { timeWindowSchema } from "./common";
import { movieSchema } from "./movie";
import { personSchema } from "./person";
import { tvSeriesSchema } from "./tv";

export const trendingSchema = z.object({
	time_window: timeWindowSchema,
	language: z.string().min(2).optional(),
});

export const trendingMoviesSchema = movieSchema.extend({
	media_type: z.literal("movie"),
});
export type TrendingMovies = z.infer<typeof trendingMoviesSchema>;

export const trendingTVSchema = tvSeriesSchema.extend({
	media_type: z.literal("tv"),
});
export type TrendingTV = z.infer<typeof trendingTVSchema>;

export const trendingPeopleSchema = personSchema.extend({
	media_type: z.literal("person"),
});
export type TrendingPeople = z.infer<typeof trendingPeopleSchema>;

export const trendingAllSchema = z.discriminatedUnion("media_type", [
	trendingMoviesSchema,
	trendingTVSchema,
	trendingPeopleSchema,
]);
export type TrendingAll = z.infer<typeof trendingAllSchema>;

export const trendingAllResultsSchema = paginatedSchema(trendingAllSchema);
export type TrendingAllResults = z.infer<typeof trendingAllResultsSchema>;

export const trendingMoviesResultsSchema =
	paginatedSchema(trendingMoviesSchema);
export type TrendingMoviesResults = z.infer<typeof trendingMoviesResultsSchema>;

export const trendingTVResultsSchema = paginatedSchema(trendingTVSchema);
export type TrendingTVResults = z.infer<typeof trendingTVResultsSchema>;

export const trendingPeopleResultsSchema =
	paginatedSchema(trendingPeopleSchema);
export type TrendingPeopleResults = z.infer<typeof trendingPeopleResultsSchema>;

export const trendingPathParamsSchema = z.object({
	media_type: z.enum(["all", "movie", "tv", "person"]),
	time_window: timeWindowSchema,
});
export type TrendingPathParams = z.infer<typeof trendingPathParamsSchema>;

export const trendingQueryParamsSchema = z.object({
	language: z.string().min(2).optional(),
});
export type TrendingQueryParams = z.infer<typeof trendingQueryParamsSchema>;
