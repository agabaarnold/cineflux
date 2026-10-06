import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { imageResultsSchema } from "#/schemas/aggregate.ts";
import {
	alternativeNamesSchema,
	collectionDetailsSchema,
	companyDetailsSchema,
	configurationSchema,
	genreListSchema,
	keywordDetailsSchema,
	networkDetailsSchema,
} from "#/schemas/catalog.ts";
import { idSchema } from "#/schemas/common.ts";
import { movieTranslationsSchema } from "#/schemas/movie.ts";
import { searchMoviesResultsSchema } from "#/schemas/search.ts";
import { tmdbFetchValidated } from "#/server/tmdb/client.ts";

export const fetchMovieGenres = createServerFn({ method: "GET" })
	.validator(z.object({ language: z.string().min(2).optional() }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/genre/movie/list`, genreListSchema, {
			params: { language: data.language },
		})
	);

export const fetchTvGenres = createServerFn({ method: "GET" })
	.validator(z.object({ language: z.string().min(2).optional() }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/genre/tv/list`, genreListSchema, {
			params: { language: data.language },
		})
	);

export const fetchConfiguration = createServerFn({ method: "GET" }).handler(
	() => tmdbFetchValidated(`/configuration`, configurationSchema)
);

export const fetchCollectionDetails = createServerFn({ method: "GET" })
	.validator(
		z.object({
			id: idSchema,
			language: z.string().min(2).optional(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(`/collection/${data.id}`, collectionDetailsSchema, {
			params: { language: data.language },
		})
	);

export const fetchCollectionImages = createServerFn({ method: "GET" })
	.validator(
		z.object({
			id: idSchema,
			language: z.string().min(2).optional(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(`/collection/${data.id}/images`, imageResultsSchema, {
			params: { language: data.language },
		})
	);

export const fetchCollectionTranslations = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/collection/${data.id}/translations`,
			movieTranslationsSchema
		)
	);

export const fetchCompanyDetails = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/company/${data.id}`, companyDetailsSchema)
	);

export const fetchCompanyAlternativeNames = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/company/${data.id}/alternative_names`,
			alternativeNamesSchema
		)
	);

export const fetchCompanyImages = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/company/${data.id}/images`, imageResultsSchema)
	);

export const fetchNetworkDetails = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/network/${data.id}`, networkDetailsSchema)
	);

export const fetchNetworkAlternativeNames = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/network/${data.id}/alternative_names`,
			alternativeNamesSchema
		)
	);

export const fetchKeywordDetails = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/keyword/${data.id}`, keywordDetailsSchema)
	);

export const fetchKeywordMovies = createServerFn({ method: "GET" })
	.validator(
		z.object({
			id: idSchema,
			language: z.string().min(2).optional(),
			page: z.number().int().positive().optional(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/keyword/${data.id}/movies`,
			searchMoviesResultsSchema,
			{
				params: { language: data.language, page: data.page },
			}
		)
	);
