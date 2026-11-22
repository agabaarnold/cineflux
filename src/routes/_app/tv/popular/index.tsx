// oxlint-disable react/function-component-definition func-style
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchTvPopularQueryOptions } from "#/queries/tv.ts";
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
	const [page, setPage] = useState(1);
	const { data, isFetching } = useSuspenseQuery(
		fetchTvPopularQueryOptions({
			data: { language: "en-US", page },
		})
	);

	const items = data.results.map((show) => ({
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
	}));

	const hasNextPage = page < data.total_pages;

	return (
		<div className="flex flex-col">
			<MediaRow items={items} title="Popular TV Shows" />
			{hasNextPage && (
				<div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-6">
					<button
						className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors"
						disabled={isFetching}
						onClick={() => setPage((p: number) => p + 1)}
						type="button"
					>
						{isFetching ? "Loading…" : "Load more"}
					</button>
				</div>
			)}
		</div>
	);
}
