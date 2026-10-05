// oxlint-disable react/function-component-definition func-style
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { fetchTrendingQueryOptions } from "#/queries/trending.ts";
import { timeWindowSchema } from "#/schemas/common.ts";

export const Route = createFileRoute("/")({
	component: Home,
	validateSearch: z.object({ time_window: timeWindowSchema.default("day") }),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps }) => {
		const trendingOptions = fetchTrendingQueryOptions({
			data: {
				language: "en-US",
				media_type: "all",
				time_window: deps.time_window,
			},
		});

		const trendingData = await context.queryClient.query({
			...trendingOptions,
			staleTime: "static",
		});

		return { trendingData };
	},
});

function Home() {
	const { trendingData } = Route.useLoaderData();

	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Trending this week</h1>
			<p>{trendingData?.results[4].media_type}</p>
		</div>
	);
}
