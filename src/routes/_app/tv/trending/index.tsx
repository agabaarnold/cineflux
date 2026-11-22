// oxlint-disable react/function-component-definition func-style
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MediaGrid } from "#/components/media/media-grid.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchTrending } from "#/server/functions/trending.ts";
import { getPosterUrl } from "#/server/tmdb/images.ts";

export const Route = createFileRoute("/_app/tv/trending/")({
	component: TrendingTvPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description: "Trending TV shows on CineFlux.",
			path: "/tv/trending",
			title: pageTitle("Trending TV Shows"),
		}),
});

function TrendingTvPage() {
	const query = useInfiniteQuery({
		queryKey: ["tv", "trending", "day"],
		queryFn: ({ pageParam = 1 }) =>
			fetchTrending({
				data: {
					language: "en-US",
					media_type: "tv",
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
			if (item.media_type !== "tv") {
				return [];
			}
			return [
				{
					href: `/tv/${item.id}`,
					id: `tv-${item.id}`,
					mediaId: item.id,
					mediaType: "tv" as const,
					image: getPosterUrl(item.poster_path),
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

	return (
		<div className="flex flex-col space-y-6">
			<MediaGrid items={items} title="Trending TV Shows" gap="gap-2" />
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
