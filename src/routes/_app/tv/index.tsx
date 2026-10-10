// oxlint-disable react/function-component-definition func-style
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { HeroCarousel } from "#/components/media/hero-carousel.tsx";
import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchTrendingQueryOptions } from "#/queries/trending.ts";
import {
	fetchTvAiringTodayQueryOptions,
	fetchTvOnTheAirQueryOptions,
	fetchTvPopularQueryOptions,
	fetchTvTopRatedQueryOptions,
} from "#/queries/tv.ts";
import { timeWindowSchema } from "#/schemas/common.ts";
import type { TrendingAll } from "#/schemas/trending.ts";
import { getBackdropUrl, getPosterUrl } from "#/server/tmdb/images.ts";

const popularTvOptions = fetchTvPopularQueryOptions({
	data: { language: "en-US", page: 1 },
});
const airingTodayTvOptions = fetchTvAiringTodayQueryOptions({
	data: { language: "en-US", page: 1 },
});
const onTheAirTvOptions = fetchTvOnTheAirQueryOptions({
	data: { language: "en-US", page: 1 },
});
const topRatedTvOptions = fetchTvTopRatedQueryOptions({
	data: { language: "en-US", page: 1 },
});

export const Route = createFileRoute("/_app/tv/")({
	validateSearch: z.object({ time_window: timeWindowSchema.default("day") }),
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) =>
		Promise.all([
			context.queryClient.query({
				...fetchTrendingQueryOptions({
					data: {
						language: "en-US",
						media_type: "tv",
						time_window: deps.time_window,
					},
				}),
				staleTime: "static",
			}),
			context.queryClient.query({
				...popularTvOptions,
				staleTime: "static",
			}),
			context.queryClient.query({
				...airingTodayTvOptions,
				staleTime: "static",
			}),
			context.queryClient.query({
				...onTheAirTvOptions,
				staleTime: "static",
			}),
			context.queryClient.query({
				...topRatedTvOptions,
				staleTime: "static",
			}),
		]),
	component: TVShowsPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description:
				"Browse popular, top-rated, and airing TV shows on CineFlux.",
			path: "/tv",
			title: pageTitle("TV Shows"),
		}),
});

function TVShowsPage() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const trendingOptions = fetchTrendingQueryOptions({
		data: {
			language: "en-US",
			media_type: "tv",
			time_window: search.time_window,
		},
	});
	const { data: trending } = useSuspenseQuery(trendingOptions);
	const { data: popular } = useSuspenseQuery(popularTvOptions);
	const { data: airingToday } = useSuspenseQuery(airingTodayTvOptions);
	const { data: onTheAir } = useSuspenseQuery(onTheAirTvOptions);
	const { data: topRated } = useSuspenseQuery(topRatedTvOptions);

	type TrendingShow = Extract<TrendingAll, { media_type: "tv" }>;
	const trendingShows = trending.results.filter(
		(item): item is TrendingShow => item.media_type === "tv"
	);

	const heroItems = trendingShows
		.filter((show) => show.backdrop_path !== null)
		.slice(0, 5)
		.map((show) => ({
			backdrop: getBackdropUrl(show.backdrop_path, "w1280"),
			href: `/tv/${show.id}`,
			id: `tv-${show.id}`,
			mediaId: show.id,
			mediaType: "tv" as const,
			meta: (show.first_air_date ?? "").slice(0, 4),
			overview: show.overview,
			title: show.name,
			voteAverage: show.vote_average,
		}));
	const heroIds = new Set(heroItems.map((item) => item.id));

	return (
		<div className="flex flex-col">
			<h1 className="sr-only">TV Shows</h1>
			<HeroCarousel items={heroItems} />

			<div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6">
				<div>
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-2xl font-semibold">Trending TV shows</h2>
						<Tabs
							onValueChange={(value) =>
								navigate({
									search: {
										// SAFETY: the only triggers carry "day" and "week" values defined below.
										time_window: value as "day" | "week",
									},
									to: ".",
								})
							}
							value={search.time_window}
						>
							<TabsList variant="line">
								<TabsTrigger value="day">Day</TabsTrigger>
								<TabsTrigger value="week">Week</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<MediaRow
						items={trendingShows
							.filter((show) => !heroIds.has(`tv-${show.id}`))
							.slice(0, 10)
							.map((show) => ({
								href: `/tv/${show.id}`,
								id: `tv-${show.id}`,
								image: getPosterUrl(show.poster_path),
								mediaId: show.id,
								mediaType: "tv",
								overview: show.overview,
								stat: { kind: "rating", value: show.vote_average } as const,
								title: show.name,
								year: (show.first_air_date ?? "").slice(0, 4),
							}))}
						title=""
					/>
				</div>

				<MediaRow
					items={popular.results.slice(0, 10).map((show) => ({
						href: `/tv/${show.id}`,
						id: String(show.id),
						mediaId: show.id,
						image: getPosterUrl(show.poster_path),
						mediaType: "tv",
						overview: show.overview,
						stat: { kind: "rating", value: show.vote_average } as const,
						title: show.name,
						year: (show.first_air_date ?? "").slice(0, 4),
					}))}
					title="Popular TV shows"
				/>

				<MediaRow
					items={airingToday.results.slice(0, 10).map((show) => ({
						href: `/tv/${show.id}`,
						id: String(show.id),
						mediaId: show.id,
						image: getPosterUrl(show.poster_path),
						mediaType: "tv",
						overview: show.overview,
						stat: { kind: "rating", value: show.vote_average } as const,
						title: show.name,
						year: (show.first_air_date ?? "").slice(0, 4),
					}))}
					title="Airing today"
				/>

				<MediaRow
					items={onTheAir.results.slice(0, 10).map((show) => ({
						href: `/tv/${show.id}`,
						id: String(show.id),
						mediaId: show.id,
						image: getPosterUrl(show.poster_path),
						mediaType: "tv",
						overview: show.overview,
						stat: { kind: "rating", value: show.vote_average } as const,
						title: show.name,
						year: (show.first_air_date ?? "").slice(0, 4),
					}))}
					title="On the air"
				/>

				<MediaRow
					items={topRated.results.slice(0, 10).map((show) => ({
						href: `/tv/${show.id}`,
						id: String(show.id),
						mediaId: show.id,
						image: getPosterUrl(show.poster_path),
						mediaType: "tv",
						overview: show.overview,
						stat: { kind: "rating", value: show.vote_average } as const,
						title: show.name,
						year: (show.first_air_date ?? "").slice(0, 4),
					}))}
					title="Top rated"
				/>
			</div>
		</div>
	);
}
