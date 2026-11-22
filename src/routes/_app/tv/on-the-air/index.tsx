// oxlint-disable react/function-component-definition func-style
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MediaGrid } from "#/components/media/media-grid.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchTvOnTheAir } from "#/server/functions/tv.ts";
import { getPosterUrl } from "#/server/tmdb/images.ts";

export const Route = createFileRoute("/_app/tv/on-the-air/")({
	component: OnTheAirTvPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description: "TV shows currently on the air on CineFlux.",
			path: "/tv/on-the-air",
			title: pageTitle("On the Air"),
		}),
});

function OnTheAirTvPage() {
	const query = useInfiniteQuery({
		queryKey: ["tv", "on-the-air"],
		queryFn: ({ pageParam = 1 }) =>
			fetchTvOnTheAir({
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
			<MediaGrid items={items} title="On the Air" gap="gap-2" />
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
