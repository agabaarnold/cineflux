// oxlint-disable react/function-component-definition func-style
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MediaGridSkeleton } from "#/components/media/media-grid-skeleton.tsx";
import { MediaGrid } from "#/components/media/media-grid.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchTrending } from "#/server/functions/trending.ts";
import { getPosterUrl } from "#/server/tmdb/images.ts";

export const Route = createFileRoute("/_app/movie/trending/")({
	component: TrendingMoviesPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description: "Trending movies on CineFlux.",
			path: "/movie/trending",
			title: pageTitle("Trending Movies"),
		}),
});

function TrendingMoviesPage() {
	const query = useInfiniteQuery({
		queryKey: ["movies", "trending", "day"],
		queryFn: ({ pageParam = 1 }) =>
			fetchTrending({
				data: {
					language: "en-US",
					media_type: "movie",
					page: pageParam,
					time_window: "day",
				},
			}),
		getNextPageParam: (lastPage) => {
			if (lastPage.page < lastPage.total_pages) {
				return lastPage.page + 1;
			}
		},
		initialPageParam: 1,
	});

	const pages = query.data?.pages ?? [];
	const items = pages.flatMap((page) =>
		page.results.flatMap((item) => {
			if (item.media_type !== "movie") {
				return [];
			}
			return [
				{
					href: `/movie/${item.id}`,
					id: `movie-${item.id}`,
					mediaId: item.id,
					mediaType: "movie" as const,
					image: getPosterUrl(item.poster_path),
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

	return (
		<div className="flex flex-col space-y-6">
			{query.isPending ? (
				<MediaGridSkeleton
					description="Movies gaining attention across the CineFlux community today."
					gap="gap-2"
					title="Trending Movies"
				/>
			) : (
				<MediaGrid
					description="Movies gaining attention across the CineFlux community today."
					gap="gap-2"
					items={items}
					title="Trending Movies"
				/>
			)}
			{query.hasNextPage && (
				<div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-4">
					<button
						className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors"
						disabled={query.isFetching}
						onClick={() => query.fetchNextPage()}
						type="button"
					>
						{query.isFetching ? "Loading…" : "Load more"}
					</button>
				</div>
			)}
		</div>
	);
}
