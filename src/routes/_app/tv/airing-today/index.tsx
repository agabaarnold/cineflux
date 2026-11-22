// oxlint-disable react/function-component-definition func-style
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MediaGridSkeleton } from "#/components/media/media-grid-skeleton.tsx";
import { MediaGrid } from "#/components/media/media-grid.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchTvAiringToday } from "#/server/functions/tv.ts";
import { getPosterUrl } from "#/server/tmdb/images.ts";

export const Route = createFileRoute("/_app/tv/airing-today/")({
	component: AiringTodayTvPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description: "TV shows airing today on CineFlux.",
			path: "/tv/airing-today",
			title: pageTitle("Airing Today"),
		}),
});

function AiringTodayTvPage() {
	const query = useInfiniteQuery({
		queryKey: ["tv", "airing-today"],
		queryFn: ({ pageParam = 1 }) =>
			fetchTvAiringToday({
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
				<MediaGridSkeleton title="Airing Today" gap="gap-2" />
			) : (
				<MediaGrid items={items} title="Airing Today" gap="gap-2" />
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
