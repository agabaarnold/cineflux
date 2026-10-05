import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { HeroCarousel } from "#/components/media/hero-carousel.tsx";
import { MediaRow } from "#/components/media-row.tsx";
import { RouteError } from "#/components/route-error.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { fetchPopularMoviesQueryOptions } from "#/queries/movie.ts";
import { fetchPopularPeopleQueryOptions } from "#/queries/person.ts";
import { fetchTrendingQueryOptions } from "#/queries/trending.ts";
import { fetchTvPopularQueryOptions } from "#/queries/tv.ts";
import { timeWindowSchema } from "#/schemas/common.ts";
import {
	getBackdropUrl,
	getPosterUrl,
	getProfileUrl,
} from "#/server/tmdb/images.ts";

const popularMoviesOptions = fetchPopularMoviesQueryOptions({
	data: { language: "en-US", page: 1 },
});
const popularTvOptions = fetchTvPopularQueryOptions({
	data: { language: "en-US", page: 1 },
});
const popularPeopleOptions = fetchPopularPeopleQueryOptions({
	data: { language: "en-US", page: 1 },
});

export const Route = createFileRoute("/")({
	component: Home,
	errorComponent: RouteError,
	loader: ({ context, deps }) =>
		Promise.all([
			context.queryClient.ensureQueryData(
				fetchTrendingQueryOptions({
					data: {
						language: "en-US",
						media_type: "all",
						time_window: deps.time_window,
					},
				})
			),
			context.queryClient.ensureQueryData(popularMoviesOptions),
			context.queryClient.ensureQueryData(popularTvOptions),
			context.queryClient.ensureQueryData(popularPeopleOptions),
		]),
	loaderDeps: ({ search }) => search,
	validateSearch: z.object({ time_window: timeWindowSchema.default("day") }),
});

const Home = () => {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const trendingOptions = fetchTrendingQueryOptions({
		data: {
			language: "en-US",
			media_type: "all",
			time_window: search.time_window,
		},
	});
	const { data: trendingData } = useSuspenseQuery(trendingOptions);
	const { data: movies } = useSuspenseQuery(popularMoviesOptions);
	const { data: shows } = useSuspenseQuery(popularTvOptions);
	const { data: people } = useSuspenseQuery(popularPeopleOptions);

	const heroItems = trendingData.results
		.filter((item) => item.media_type === "movie" || item.media_type === "tv")
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
			meta: (
				item.media_type === "movie" ? item.release_date : (item.first_air_date ?? "")
			).slice(0, 4),
		}));
	const heroIds = new Set(heroItems.map((item) => item.id));

	return (
		<div className="flex flex-col">
			<HeroCarousel items={heroItems} />

			<div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-6">
				<div>
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-2xl font-semibold">Trending</h2>
						<Tabs
							value={search.time_window}
							onValueChange={(value) =>
								navigate({
									search: {
										// SAFETY: the only triggers carry "day" and "week" values defined below.
										time_window: value as "day" | "week",
									},
								})
							}
						>
							<TabsList variant="line">
								<TabsTrigger value="day">Day</TabsTrigger>
								<TabsTrigger value="week">Week</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<MediaRow
						items={trendingData.results
							.filter((item) => !heroIds.has(`${item.media_type}-${item.id}`))
							.slice(0, 10)
							.map((item) => ({
								href:
									item.media_type === "movie"
										? `/movie/${item.id}`
										: item.media_type === "tv"
											? `/tv/${item.id}`
											: `/person/${item.id}`,
								id: `${item.media_type}-${item.id}`,
								image:
									item.media_type === "person"
										? getProfileUrl(item.profile_path)
										: getPosterUrl(item.poster_path),
								subtitle:
									item.media_type === "movie"
										? item.release_date
										: item.media_type === "tv"
											? (item.first_air_date ?? "")
											: item.known_for_department,
								title: item.media_type === "movie" ? item.title : item.name,
							}))}
						title=""
					/>
				</div>
				<MediaRow
					items={movies.results.slice(0, 10).map((movie) => ({
						href: `/movie/${movie.id}`,
						id: String(movie.id),
						image: getPosterUrl(movie.poster_path),
						subtitle: movie.release_date,
						title: movie.title,
					}))}
					title="Popular movies"
				/>
				<MediaRow
					items={shows.results.slice(0, 10).map((show) => ({
						href: `/tv/${show.id}`,
						id: String(show.id),
						image: getPosterUrl(show.poster_path),
						subtitle: show.first_air_date ?? "",
						title: show.name,
					}))}
					title="Popular TV shows"
				/>
				<MediaRow
					items={people.results.slice(0, 10).map((person) => ({
						href: `/person/${person.id}`,
						id: String(person.id),
						image: getProfileUrl(person.profile_path),
						subtitle: person.known_for_department,
						title: person.name,
					}))}
					title="Popular people"
				/>
			</div>
		</div>
	);
};
