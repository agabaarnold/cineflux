// oxlint-disable react/function-component-definition func-style unicorn/prefer-ternary sonarjs/no-duplicate-string
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { MediaGridSkeleton } from "#/components/media/media-grid-skeleton.tsx";
import { MediaGrid } from "#/components/media/media-grid.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import {
	discoverMovies,
	discoverTvShows,
} from "#/server/functions/discover.ts";
import { getPosterUrl } from "#/server/tmdb/images.ts";

const movieSortOptions = [
	["popularity.desc", "Popularity"],
	["release_date.desc", "Newest"],
	["release_date.asc", "Oldest"],
	["vote_average.desc", "Highest rated"],
	["vote_average.asc", "Lowest rated"],
] as const;

const tvSortOptions = [
	["popularity.desc", "Popularity"],
	["first_air_date.desc", "Newest"],
	["first_air_date.asc", "Oldest"],
	["vote_average.desc", "Highest rated"],
	["vote_average.asc", "Lowest rated"],
] as const;

const normalizeTvSort = (sort: string) => {
	if (sort === "first_air_date.asc") {
		return "first_air_date.asc";
	}
	if (sort === "first_air_date.desc") {
		return "first_air_date.desc";
	}
	if (sort === "vote_average.asc") {
		return "vote_average.asc";
	}
	if (sort === "vote_average.desc") {
		return "vote_average.desc";
	}
	return "popularity.desc";
};

const normalizeMovieSort = (sort: string) => {
	if (sort === "release_date.asc") {
		return "release_date.asc";
	}
	if (sort === "release_date.desc") {
		return "release_date.desc";
	}
	if (sort === "vote_average.asc") {
		return "vote_average.asc";
	}
	if (sort === "vote_average.desc") {
		return "vote_average.desc";
	}
	if (sort === "popularity.asc") {
		return "popularity.asc";
	}
	return "popularity.desc";
};

export const Route = createFileRoute("/_app/discover/")({
	validateSearch: z.object({
		type: z.enum(["movie", "tv"]).default("movie"),
		sort: z.string().default("popularity.desc"),
		year: z.preprocess(
			(value) => (/^\d{4}$/u.test(String(value)) ? String(value) : undefined),
			z.string().optional()
		),
	}),
	component: DiscoverPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description: "Discover movies and TV shows on CineFlux.",
			path: "/discover",
			title: pageTitle("Discover"),
		}),
});

function DiscoverPage() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const year = search.year ? Number(search.year) : undefined;

	const query = useInfiniteQuery({
		queryKey: ["discover", search.type, search.sort, search.year],
		queryFn: ({ pageParam = 1 }) => {
			if (search.type === "tv") {
				return discoverTvShows({
					data: {
						first_air_date_year: year,
						language: "en-US",
						page: pageParam,
						sort_by: normalizeTvSort(search.sort),
					},
				});
			}
			return discoverMovies({
				data: {
					language: "en-US",
					page: pageParam,
					primary_release_year: year,
					sort_by: normalizeMovieSort(search.sort),
				},
			});
		},
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
		initialPageParam: 1,
	});

	const pages = query.data?.pages ?? [];
	let items;
	if (search.type === "movie") {
		items = pages.flatMap((page) =>
			page.results.flatMap((item) => {
				if (!("title" in item)) {
					return [];
				}
				return [
					{
						href: `/movie/${item.id}`,
						id: `movie-${item.id}`,
						image: getPosterUrl(item.poster_path),
						mediaId: item.id,
						mediaType: "movie" as const,
						overview: item.overview,
						stat: {
							kind: "rating" as const,
							value: item.vote_average,
						},
						title: item.title,
						year: item.release_date.slice(0, 4),
					},
				];
			})
		);
	} else {
		items = pages.flatMap((page) =>
			page.results.flatMap((item) => {
				if (!("name" in item)) {
					return [];
				}
				return [
					{
						href: `/tv/${item.id}`,
						id: `tv-${item.id}`,
						image: getPosterUrl(item.poster_path),
						mediaId: item.id,
						mediaType: "tv" as const,
						overview: item.overview,
						stat: {
							kind: "rating" as const,
							value: item.vote_average,
						},
						title: item.name,
						year: (item.first_air_date ?? "").slice(0, 4),
					},
				];
			})
		);
	}

	const sortOptions =
		search.type === "movie" ? movieSortOptions : tvSortOptions;

	const setType = (type: "movie" | "tv") => {
		navigate({
			search: {
				sort: "popularity.desc",
				type,
				year: search.year,
			},
			to: "/discover",
		});
	};

	const resetFilters = () => {
		navigate({
			search: { sort: "popularity.desc", type: "movie" },
			to: "/discover",
		});
	};

	return (
		<div className="mx-auto w-full max-w-7xl px-4 pt-24 pb-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Discover</h1>
				<p className="text-muted-foreground mt-1">
					Browse movies and TV shows by release year and rating.
				</p>
			</div>

			<form
				className="mb-2 flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row sm:items-end"
				onSubmit={(event) => event.preventDefault()}
			>
				<div className="flex-1">
					<label
						className="mb-1.5 block text-sm font-medium"
						htmlFor="media-type"
					>
						Media type
					</label>
					<select
						className="border-input bg-background h-11 w-full rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
						id="media-type"
						onChange={(event) => {
							const { value } = event.target;
							if (value === "movie" || value === "tv") {
								setType(value);
							}
						}}
						value={search.type}
					>
						<option value="movie">Movies</option>
						<option value="tv">TV Shows</option>
					</select>
				</div>

				<div className="flex-1">
					<label className="mb-1.5 block text-sm font-medium" htmlFor="sort-by">
						Sort by
					</label>
					<select
						className="border-input bg-background h-11 w-full rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
						id="sort-by"
						onChange={(event) =>
							navigate({
								search: { ...search, sort: event.target.value },
								to: "/discover",
							})
						}
						value={search.sort}
					>
						{sortOptions.map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div className="flex-1">
					<label
						className="mb-1.5 block text-sm font-medium"
						htmlFor="release-year"
					>
						Release year
					</label>
					<Input
						className="h-11"
						id="release-year"
						inputMode="numeric"
						max={2100}
						min={1800}
						onChange={(event) =>
							navigate({
								search: {
									...search,
									year: event.target.value || undefined,
								},
								to: "/discover",
							})
						}
						placeholder="Any year"
						type="number"
						value={search.year ?? ""}
					/>
				</div>

				<Button
					className="h-11"
					onClick={resetFilters}
					type="button"
					variant="outline"
				>
					Reset
				</Button>
			</form>

			{query.isPending ? (
				<MediaGridSkeleton compact gap="gap-3" title="" />
			) : null}
			{!query.isPending && items.length === 0 ? (
				<div className="my-8 rounded-2xl border border-dashed px-6 py-16 text-center">
					<h2 className="text-xl font-semibold">No titles found</h2>
					<p className="text-muted-foreground mt-1 text-sm">
						Try changing the media type, year, or sorting.
					</p>
					<Button className="mt-5 h-11" onClick={resetFilters}>
						Reset filters
					</Button>
				</div>
			) : null}
			{!query.isPending && items.length > 0 ? (
				<MediaGrid
					gap="gap-3"
					items={items}
					title={search.type === "movie" ? "Movies" : "TV Shows"}
				/>
			) : null}

			{query.hasNextPage && !query.isPending ? (
				<div className="flex justify-center py-4">
					<Button
						disabled={query.isFetching}
						onClick={() => query.fetchNextPage()}
						size="lg"
						type="button"
					>
						{query.isFetching ? "Loading…" : "Load more"}
					</Button>
				</div>
			) : null}
		</div>
	);
}
