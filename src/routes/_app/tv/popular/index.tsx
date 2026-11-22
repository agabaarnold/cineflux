// oxlint-disable react/function-component-definition func-style
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MediaGridSkeleton } from "#/components/media/media-grid-skeleton.tsx";
import { MediaGrid } from "#/components/media/media-grid.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchTvPopular } from "#/server/functions/tv.ts";
import { getPosterUrl } from "#/server/tmdb/images.ts";

export const Route = createFileRoute("/_app/tv/popular/")({
	component: PopularTvPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description: "Popular TV shows on CineFlux.",
			path: "/tv/popular",
			title: pageTitle("Popular TV Shows"),
		}),
});

function PopularTvPage() {
	const query = useInfiniteQuery({
		queryKey: ["tv", "popular"],
		queryFn: ({ pageParam = 1 }) =>
			fetchTvPopular({
				data: { language: "en-US", page: pageParam },
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
		page.results.map((show) => ({
			href: `/tv/${show.id}`,
			id: `tv-${show.id}`,
			mediaId: show.id,
			mediaType: "tv" as const,
			image: getPosterUrl(show.poster_path),
			overview: show.overview,
			stat: {
				kind: "rating",
				value: show.vote_average,
			} as const,
			title: show.name,
			year: (show.first_air_date ?? "").slice(0, 4),
		}))
	);

	return (
		<div className="flex flex-col space-y-6">
			{query.isPending ? (
				<MediaGridSkeleton
					description="TV shows with the highest popularity and audience interest."
					gap="gap-2"
					title="Popular TV Shows"
				/>
			) : (
				<MediaGrid
					description="TV shows with the highest popularity and audience interest."
					gap="gap-2"
					items={items}
					title="Popular TV Shows"
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
