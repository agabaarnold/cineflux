// oxlint-disable react/function-component-definition func-style
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { HeroCarousel } from "#/components/media/hero-carousel.tsx";
import { fetchTrendingQueryOptions } from "#/queries/trending.ts";
import { timeWindowSchema } from "#/schemas/common.ts";
import { getBackdropUrl } from "#/server/tmdb/images.ts";

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

	const screenItems = trendingData.results.filter(
		(item) => item.media_type === "movie" || item.media_type === "tv"
	);
	const heroItems = screenItems
		.filter((item) => item.backdrop_path !== null)
		.slice(0, 5)
		.map((item) => ({
			id: `${item.media_type}-${item.id}`,
			href:
				item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`,
			backdrop: getBackdropUrl(item.backdrop_path, "w1280"),
			title: item.media_type === "movie" ? item.title : item.name,
			overview: item.overview,
			voteAverage: item.vote_average,
			meta: (item.media_type === "movie"
				? item.release_date
				: (item.first_air_date ?? "")
			).slice(0, 4),
		}));

	return (
		<div className="">
			<HeroCarousel items={heroItems} />
		</div>
	);
}
