import { createServerFn } from "@tanstack/react-start";

import {
	searchCollectionsResultsSchema,
	searchCompaniesResultsSchema,
	searchCompaniesParamsSchema,
	searchCollectionsParamsSchema,
	searchKeywordsParamsSchema,
	searchKeywordsResultsSchema,
	searchMoviesParamsSchema,
	searchMoviesResultsSchema,
	searchMultiParamsSchema,
	searchMultiResultsSchema,
	searchPeopleParamsSchema,
	searchPeopleResultsSchema,
	searchTvParamsSchema,
	searchTvResultsSchema,
} from "#/schemas/search.ts";
import { tmdbFetchValidated } from "#/server/tmdb/client.ts";

export const searchMovies = createServerFn({ method: "GET" })
	.validator(searchMoviesParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/search/movie`, searchMoviesResultsSchema, {
			params: {
				include_adult: data.include_adult,
				language: data.language,
				page: data.page,
				primary_release_year: data.primary_release_year,
				query: data.query,
				region: data.region,
				year: data.year,
			},
		})
	);

export const searchTvShows = createServerFn({ method: "GET" })
	.validator(searchTvParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/search/tv`, searchTvResultsSchema, {
			params: {
				first_air_date_year: data.first_air_date_year,
				include_adult: data.include_adult,
				language: data.language,
				page: data.page,
				query: data.query,
				year: data.year,
			},
		})
	);

export const searchPeople = createServerFn({ method: "GET" })
	.validator(searchPeopleParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/search/person`, searchPeopleResultsSchema, {
			params: {
				include_adult: data.include_adult,
				language: data.language,
				page: data.page,
				query: data.query,
			},
		})
	);

export const searchMulti = createServerFn({ method: "GET" })
	.validator(searchMultiParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/search/multi`, searchMultiResultsSchema, {
			params: {
				include_adult: data.include_adult,
				language: data.language,
				page: data.page,
				query: data.query,
			},
		})
	);

export const searchCollections = createServerFn({ method: "GET" })
	.validator(searchCollectionsParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/search/collection`, searchCollectionsResultsSchema, {
			params: {
				language: data.language,
				page: data.page,
				query: data.query,
			},
		})
	);

export const searchCompanies = createServerFn({ method: "GET" })
	.validator(searchCompaniesParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/search/company`, searchCompaniesResultsSchema, {
			params: { page: data.page, query: data.query },
		})
	);

export const searchKeywords = createServerFn({ method: "GET" })
	.validator(searchKeywordsParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/search/keyword`, searchKeywordsResultsSchema, {
			params: { page: data.page, query: data.query },
		})
	);
