// oxlint-disable react/function-component-definition func-style
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { HeroCarousel } from "#/components/media/hero-carousel.tsx";
import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import {
	fetchNowPlayingMoviesQueryOptions,
	fetchPopularMoviesQueryOptions,
	fetchTopRatedMoviesQueryOptions,
	fetchUpcomingMoviesQueryOptions,
} from "#/queries/movie.ts";
import { fetchTrendingQueryOptions } from "#/queries/trending.ts";
import { timeWindowSchema } from "#/schemas/common.ts";
import type { TrendingAll } from "#/schemas/trending.ts";
import { getBackdropUrl, getPosterUrl } from "#/server/tmdb/images.ts";

const popularMoviesOptions = fetchPopularMoviesQueryOptions({
	data: { language: "en-US", page: 1 },
});
const nowPlayingMoviesOptions = fetchNowPlayingMoviesQueryOptions({
	data: { language: "en-US", page: 1 },
});
const topRatedMoviesOptions = fetchTopRatedMoviesQueryOptions({
	data: { language: "en-US", page: 1 },
});
const upcomingMoviesOptions = fetchUpcomingMoviesQueryOptions({
	data: { language: "en-US", page: 1 },
});

export const Route = createFileRoute("/_app/movie/")({
	validateSearch: z.object({ time_window: timeWindowSchema.default("day") }),
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) =>
		Promise.all([
			context.queryClient.query({
				...fetchTrendingQueryOptions({
					data: {
						language: "en-US",
						media_type: "movie",
						time_window: deps.time_window,
					},
				}),
				staleTime: "static",
			}),
			context.queryClient.query({
				...popularMoviesOptions,
				staleTime: "static",
			}),
			context.queryClient.query({
				...nowPlayingMoviesOptions,
				staleTime: "static",
			}),
			context.queryClient.query({
				...topRatedMoviesOptions,
				staleTime: "static",
			}),
			context.queryClient.query({
				...upcomingMoviesOptions,
				staleTime: "static",
			}),
		]),
	component: MoviesPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description:
				"Browse popular, top-rated, and upcoming movies on CineFlux.",
			path: "/movie",
			title: pageTitle("Movies"),
		}),
});

function MoviesPage() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const trendingOptions = fetchTrendingQueryOptions({
		data: {
			language: "en-US",
			media_type: "movie",
			time_window: search.time_window,
		},
	});
	const { data: trending } = useSuspenseQuery(trendingOptions);
	const { data: popular } = useSuspenseQuery(popularMoviesOptions);
	const { data: nowPlaying } = useSuspenseQuery(nowPlayingMoviesOptions);
	const { data: topRated } = useSuspenseQuery(topRatedMoviesOptions);
	const { data: upcoming } = useSuspenseQuery(upcomingMoviesOptions);

	type TrendingMovie = Extract<TrendingAll, { media_type: "movie" }>;
	const trendingMovies = trending.results.filter(
		(item): item is TrendingMovie => item.media_type === "movie"
	);

	const heroItems = trendingMovies
		.filter((movie) => movie.backdrop_path !== null)
		.slice(0, 5)
		.map((movie) => ({
			backdrop: getBackdropUrl(movie.backdrop_path, "w1280"),
			href: `/movie/${movie.id}`,
			id: `movie-${movie.id}`,
			mediaId: movie.id,
			mediaType: "movie" as const,
			meta: movie.release_date.slice(0, 4),
			overview: movie.overview,
			title: movie.title,
			voteAverage: movie.vote_average,
		}));
	const heroIds = new Set(heroItems.map((item) => item.id));

	return (
		<div className="flex flex-col">
			<h1 className="sr-only">Movies</h1>
			<HeroCarousel items={heroItems} />

			<div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6">
				<div>
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-2xl font-semibold">Trending movies</h2>
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
						items={trendingMovies
							.filter((movie) => !heroIds.has(`movie-${movie.id}`))
							.slice(0, 10)
							.map((movie) => ({
								href: `/movie/${movie.id}`,
								id: `movie-${movie.id}`,
								image: getPosterUrl(movie.poster_path),
								mediaId: movie.id,
								mediaType: "movie",
								overview: movie.overview,
								stat: { kind: "rating", value: movie.vote_average } as const,
								title: movie.title,
								year: movie.release_date.slice(0, 4),
							}))}
						title=""
					/>
				</div>

				<MediaRow
					items={popular.results.slice(0, 10).map((movie) => ({
						href: `/movie/${movie.id}`,
						id: String(movie.id),
						mediaId: movie.id,
						image: getPosterUrl(movie.poster_path),
						mediaType: "movie",
						overview: movie.overview,
						stat: { kind: "rating", value: movie.vote_average } as const,
						title: movie.title,
						year: movie.release_date.slice(0, 4),
					}))}
					title="Popular movies"
				/>

				<MediaRow
					items={nowPlaying.results.slice(0, 10).map((movie) => ({
						href: `/movie/${movie.id}`,
						id: String(movie.id),
						mediaId: movie.id,
						image: getPosterUrl(movie.poster_path),
						mediaType: "movie",
						overview: movie.overview,
						stat: { kind: "rating", value: movie.vote_average } as const,
						title: movie.title,
						year: movie.release_date.slice(0, 4),
					}))}
					title="Now playing"
				/>

				<MediaRow
					items={topRated.results.slice(0, 10).map((movie) => ({
						href: `/movie/${movie.id}`,
						id: String(movie.id),
						mediaId: movie.id,
						image: getPosterUrl(movie.poster_path),
						mediaType: "movie",
						overview: movie.overview,
						stat: { kind: "rating", value: movie.vote_average } as const,
						title: movie.title,
						year: movie.release_date.slice(0, 4),
					}))}
					title="Top rated"
				/>

				<MediaRow
					items={upcoming.results.slice(0, 10).map((movie) => ({
						href: `/movie/${movie.id}`,
						id: String(movie.id),
						mediaId: movie.id,
						image: getPosterUrl(movie.poster_path),
						mediaType: "movie",
						overview: movie.overview,
						stat: { kind: "rating", value: movie.vote_average } as const,
						title: movie.title,
						year: movie.release_date.slice(0, 4),
					}))}
					title="Upcoming"
				/>
			</div>
		</div>
	);
}
