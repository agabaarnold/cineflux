import { createServerFn } from "@tanstack/react-start";

import {
	discoverMoviesParamsSchema,
	discoverMoviesResultsSchema,
	discoverTvParamsSchema,
	discoverTvResultsSchema,
} from "#/schemas/discover.ts";
import { tmdbFetchValidated } from "#/server/tmdb/client.ts";

export const discoverMovies = createServerFn({ method: "GET" })
	.validator(discoverMoviesParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/discover/movie`, discoverMoviesResultsSchema, {
			params: {
				include_adult: data.include_adult,
				include_video: data.include_video,
				language: data.language,
				page: data.page,
				primary_release_year: data.primary_release_year,
				region: data.region,
				"release_date.gte": data["release_date.gte"],
				"release_date.lte": data["release_date.lte"],
				sort_by: data.sort_by,
				"vote_average.gte": data["vote_average.gte"],
				"vote_count.gte": data["vote_count.gte"],
				with_companies: data.with_companies,
				with_genres: data.with_genres,
				with_keywords: data.with_keywords,
				with_original_language: data.with_original_language,
				year: data.year,
			},
		})
	);

export const discoverTvShows = createServerFn({ method: "GET" })
	.validator(discoverTvParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/discover/tv`, discoverTvResultsSchema, {
			params: {
				first_air_date_year: data.first_air_date_year,
				language: data.language,
				page: data.page,
				sort_by: data.sort_by,
				timezone: data.timezone,
				"vote_average.gte": data["vote_average.gte"],
				"vote_count.gte": data["vote_count.gte"],
				with_companies: data.with_companies,
				with_genres: data.with_genres,
				with_networks: data.with_networks,
				with_original_language: data.with_original_language,
			},
		})
	);
