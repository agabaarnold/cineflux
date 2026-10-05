import { createServerFn } from "@tanstack/react-start";

import {
	trendingAllResultsSchema,
	trendingMoviesResultsSchema,
	trendingPathParamsSchema,
	trendingPeopleResultsSchema,
	trendingSchema,
	trendingTVResultsSchema,
} from "#/schemas/trending.ts";
import { tmdbFetchValidated } from "#/server/tmdb/client.ts";

const trendingInputSchema = trendingSchema.extend(
	trendingPathParamsSchema.pick({ media_type: true }).shape
);

const trendingResponseSchemas = {
	all: trendingAllResultsSchema,
	movie: trendingMoviesResultsSchema,
	person: trendingPeopleResultsSchema,
	tv: trendingTVResultsSchema,
} as const;

export const fetchTrending = createServerFn({ method: "GET" })
	.validator(trendingInputSchema)
	.handler(({ data }) =>
		tmdbFetchValidated(
			`/trending/${data.media_type}/${data.time_window}`,
			trendingResponseSchemas[data.media_type],
			{ params: { language: data.language } }
		)
	);
