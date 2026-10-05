import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { HeroCarousel } from "#/components/media/hero-carousel.tsx";
import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { fetchPopularMoviesQueryOptions } from "#/queries/movie.ts";
import { fetchPopularPeopleQueryOptions } from "#/queries/person.ts";
import { fetchTrendingQueryOptions } from "#/queries/trending.ts";
import { fetchTvPopularQueryOptions } from "#/queries/tv.ts";
import { timeWindowSchema } from "#/schemas/common.ts";
import type { TrendingAllResults } from "#/schemas/trending.ts";
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

type TrendingRowItem = TrendingAllResults["results"][number];

const trendingHref = (item: TrendingRowItem) => {
	if (item.media_type === "movie") {
		return `/movie/${item.id}`;
	}
	if (item.media_type === "tv") {
		return `/tv/${item.id}`;
	}
	return `/person/${item.id}`;
};

const trendingTitle = (item: TrendingRowItem) =>
	item.media_type === "movie" ? item.title : item.name;

const trendingYear = (item: TrendingRowItem) => {
	if (item.media_type === "movie") {
		return item.release_date.slice(0, 4);
	}
	if (item.media_type === "tv") {
		return (item.first_air_date ?? "").slice(0, 4);
	}
	return item.known_for_department;
};

const trendingStat = (item: TrendingRowItem) => {
	if (item.media_type === "person") {
		return { kind: "popularity", value: item.popularity } as const;
	}

	return { kind: "rating", value: item.vote_average } as const;
};

const trendingImage = (item: TrendingRowItem) =>
	item.media_type === "person"
		? getProfileUrl(item.profile_path)
		: getPosterUrl(item.poster_path);

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
		.filter(
			(
				item
			): item is Extract<TrendingRowItem, { media_type: "movie" | "tv" }> =>
				(item.media_type === "movie" || item.media_type === "tv") &&
				item.backdrop_path !== null
		)
		.slice(0, 5)
		.map((item) => ({
			id: `${item.media_type}-${item.id}`,
			href:
				item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`,
			backdrop: getBackdropUrl(item?.backdrop_path, "w1280"),
			title: item.media_type === "movie" ? item.title : item.name,
			overview: item.overview,
			voteAverage: item.vote_average,
			meta: (item.media_type === "movie"
				? item.release_date
				: (item.first_air_date ?? "")
			).slice(0, 4),
		}));
	const heroIds = new Set(heroItems.map((item) => item.id));

	return (
		<div className="flex flex-col">
			<HeroCarousel items={heroItems} />

			<div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6">
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
									to: ".",
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
								href: trendingHref(item),
								id: `${item.media_type}-${item.id}`,
								image: trendingImage(item),
								mediaType: item.media_type,
								overview:
									item.media_type === "person"
										? (item.known_for?.[0]?.overview ?? "")
										: item.overview,
								stat: trendingStat(item),
								title: trendingTitle(item),
								year: trendingYear(item),
							}))}
						title=""
					/>
				</div>

				<MediaRow
					items={movies.results.slice(0, 10).map((movie) => ({
						href: `/movie/${movie.id}`,
						id: String(movie.id),
						image: getPosterUrl(movie.poster_path),
						mediaType: "movie",
						overview: movie.overview,
						stat: { kind: "rating", value: movie.vote_average } as const,
						title: movie.title,
						year: movie.release_date.slice(0, 4),
					}))}
					title="Popular movies"
					href="/movie"
				/>

				<MediaRow
					items={shows.results.slice(0, 10).map((show) => ({
						href: `/tv/${show.id}`,
						id: String(show.id),
						image: getPosterUrl(show.poster_path),
						mediaType: "tv",
						overview: show.overview,
						stat: { kind: "rating", value: show.vote_average } as const,
						title: show.name,
						year: (show.first_air_date ?? "").slice(0, 4),
					}))}
					title="Popular TV shows"
					href="/tv"
				/>

				<MediaRow
					items={people.results.slice(0, 10).map((person) => ({
						href: `/person/${person.id}`,
						id: String(person.id),
						image: getProfileUrl(person.profile_path),
						mediaType: "person",
						overview: person.known_for?.[0]?.overview ?? "",
						stat: { kind: "popularity", value: person.popularity } as const,
						title: person.name,
						year: person.known_for_department,
					}))}
					title="Popular people"
					href="/people"
				/>
			</div>
		</div>
	);
};

export const Route = createFileRoute("/")({
	validateSearch: z.object({ time_window: timeWindowSchema.default("day") }),
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) =>
		Promise.all([
			context.queryClient.query({
				...fetchTrendingQueryOptions({
					data: {
						language: "en-US",
						media_type: "all",
						time_window: deps.time_window,
					},
				}),
				staleTime: "static",
			}),
			context.queryClient.query({
				...popularMoviesOptions,
				staleTime: "static",
			}),
			context.queryClient.query({ ...popularTvOptions, staleTime: "static" }),
			context.queryClient.query({
				...popularPeopleOptions,
				staleTime: "static",
			}),
		]),
	component: Home,
	errorComponent: RouteError,
});
