import { z } from "zod";

import { paginatedSchema } from "./aggregate";
import { countrySchema, idSchema } from "./common";
import { movieSchema } from "./movie";
import { personSchema } from "./person";
import { trendingAllSchema } from "./trending";
import { tvSeriesSchema } from "./tv";

export const searchMoviesParamsSchema = z.object({
	include_adult: z.boolean().optional(),
	language: z.string().min(2).optional(),
	page: z.number().int().positive().optional(),
	primary_release_year: z.number().int().optional(),
	query: z.string().min(1),
	region: countrySchema.optional(),
	year: z.number().int().optional(),
});
export type SearchMoviesParams = z.infer<typeof searchMoviesParamsSchema>;

export const searchTvParamsSchema = z.object({
	first_air_date_year: z.number().int().optional(),
	include_adult: z.boolean().optional(),
	language: z.string().min(2).optional(),
	page: z.number().int().positive().optional(),
	query: z.string().min(1),
	year: z.number().int().optional(),
});
export type SearchTvParams = z.infer<typeof searchTvParamsSchema>;

export const searchPeopleParamsSchema = z.object({
	include_adult: z.boolean().optional(),
	language: z.string().min(2).optional(),
	page: z.number().int().positive().optional(),
	query: z.string().min(1),
});
export type SearchPeopleParams = z.infer<typeof searchPeopleParamsSchema>;

export const searchMultiParamsSchema = searchPeopleParamsSchema;
export type SearchMultiParams = z.infer<typeof searchMultiParamsSchema>;

export const searchMoviesResultsSchema = paginatedSchema(movieSchema);
export type SearchMoviesResults = z.infer<typeof searchMoviesResultsSchema>;

export const searchTvResultsSchema = paginatedSchema(tvSeriesSchema);
export type SearchTvResults = z.infer<typeof searchTvResultsSchema>;

export const searchPeopleResultsSchema = paginatedSchema(personSchema);
export type SearchPeopleResults = z.infer<typeof searchPeopleResultsSchema>;

export const searchMultiResultsSchema = paginatedSchema(trendingAllSchema);
export type SearchMultiResults = z.infer<typeof searchMultiResultsSchema>;

export const searchCollectionsParamsSchema = z.object({
	language: z.string().min(2).optional(),
	page: z.number().int().positive().optional(),
	query: z.string().min(1),
});
export type SearchCollectionsParams = z.infer<
	typeof searchCollectionsParamsSchema
>;

export const collectionResultSchema = z.object({
	adult: z.boolean().default(false),
	backdrop_path: z.string().nullable(),
	id: idSchema,
	name: z.string(),
	original_language: z.string().optional(),
	original_name: z.string(),
	overview: z.string(),
	poster_path: z.string().nullable(),
});
export type CollectionResult = z.infer<typeof collectionResultSchema>;

export const searchCollectionsResultsSchema = paginatedSchema(
	collectionResultSchema
);
export type SearchCollectionsResults = z.infer<
	typeof searchCollectionsResultsSchema
>;

export const searchCompaniesParamsSchema = z.object({
	page: z.number().int().positive().optional(),
	query: z.string().min(1),
});
export type SearchCompaniesParams = z.infer<typeof searchCompaniesParamsSchema>;

export const companyResultSchema = z.object({
	id: idSchema,
	logo_path: z.string().nullable(),
	name: z.string(),
	origin_country: z.string(),
});
export type CompanyResult = z.infer<typeof companyResultSchema>;

export const searchCompaniesResultsSchema =
	paginatedSchema(companyResultSchema);
export type SearchCompaniesResults = z.infer<
	typeof searchCompaniesResultsSchema
>;

export const searchKeywordsParamsSchema = searchCompaniesParamsSchema;
export type SearchKeywordsParams = z.infer<typeof searchKeywordsParamsSchema>;

export const keywordResultSchema = z.object({
	id: idSchema,
	name: z.string(),
});
export type KeywordResult = z.infer<typeof keywordResultSchema>;

export const searchKeywordsResultsSchema = paginatedSchema(keywordResultSchema);
export type SearchKeywordsResults = z.infer<typeof searchKeywordsResultsSchema>;
