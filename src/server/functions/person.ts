import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { imageResultsSchema } from "#/schemas/aggregate.ts";
import { idSchema } from "#/schemas/common.ts";
import {
	buildPersonAppendToResponse,
	personAppendToResponseSchema,
	personCombinedCreditsSchema,
	personDetailsSchema,
	personDetailsWithAppendSchema,
	personExternalIdsSchema,
	personMovieCreditsSchema,
	personQueryParamsSchema,
	personResultsSchema,
	personTaggedImagesSchema,
	personTranslationsSchema,
	personTvCreditsSchema,
} from "#/schemas/person.ts";
import { tmdbFetchValidated } from "#/server/tmdb/client.ts";

const personIdInputSchema = z.object({
	id: idSchema,
	language: z.string().min(2).optional(),
});

export const fetchPersonDetails = createServerFn({ method: "GET" })
	.validator(
		personIdInputSchema.extend({
			append_to_response: z
				.array(personAppendToResponseSchema)
				.max(20)
				.optional(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(`/person/${data.id}`, personDetailsWithAppendSchema, {
			params: {
				append_to_response: buildPersonAppendToResponse(
					data.append_to_response ?? []
				),
				language: data.language,
			},
		})
	);

export const fetchPersonCombinedCredits = createServerFn({ method: "GET" })
	.validator(personIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/person/${data.id}/combined_credits`,
			personCombinedCreditsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchPersonMovieCredits = createServerFn({ method: "GET" })
	.validator(personIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/person/${data.id}/movie_credits`,
			personMovieCreditsSchema,
			{ params: { language: data.language } }
		)
	);

export const fetchPersonTvCredits = createServerFn({ method: "GET" })
	.validator(personIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/person/${data.id}/tv_credits`, personTvCreditsSchema, {
			params: { language: data.language },
		})
	);

export const fetchPersonExternalIds = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/person/${data.id}/external_ids`,
			personExternalIdsSchema
		)
	);

export const fetchPersonImages = createServerFn({ method: "GET" })
	.validator(personIdInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/person/${data.id}/images`, imageResultsSchema, {
			params: { language: data.language },
		})
	);

export const fetchPersonTaggedImages = createServerFn({ method: "GET" })
	.validator(
		z.object({
			id: idSchema,
			language: z.string().min(2).optional(),
			page: z.number().int().positive().optional(),
		})
	)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/person/${data.id}/tagged_images`,
			personTaggedImagesSchema,
			{ params: { language: data.language, page: data.page } }
		)
	);

export const fetchPersonTranslations = createServerFn({ method: "GET" })
	.validator(z.object({ id: idSchema }))
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/person/${data.id}/translations`,
			personTranslationsSchema
		)
	);

export const fetchPersonLatest = createServerFn({ method: "GET" })
	.validator(personQueryParamsSchema.pick({ language: true }))
	.handler(({ data }) =>
		tmdbFetchValidated(`/person/latest`, personDetailsSchema, {
			params: { language: data.language },
		})
	);

export const fetchPopularPeople = createServerFn({ method: "GET" })
	.validator(personQueryParamsSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(`/person/popular`, personResultsSchema, {
			params: { language: data.language, page: data.page },
		})
	);
