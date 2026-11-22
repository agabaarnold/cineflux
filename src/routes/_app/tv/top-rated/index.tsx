// oxlint-disable react/function-component-definition func-style
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MediaGrid } from "#/components/media/media-grid.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchTvTopRated } from "#/server/functions/tv.ts";
import { getPosterUrl } from "#/server/tmdb/images.ts";

export const Route = createFileRoute("/_app/tv/top-rated/")({
	component: TopRatedTvPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description: "Top rated TV shows on CineFlux.",
			path: "/tv/top-rated",
			title: pageTitle("Top Rated TV Shows"),
		}),
});

function TopRatedTvPage() {
	const query = useInfiniteQuery({
		queryKey: ["tv", "top-rated"],
		queryFn: ({ pageParam = 1 }) =>
			fetchTvTopRated({
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
			<MediaGrid items={items} title="Top Rated TV Shows" gap="gap-2" />
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
