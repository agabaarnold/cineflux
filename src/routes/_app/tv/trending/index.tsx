// oxlint-disable react/function-component-definition func-style
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MediaGrid } from "#/components/media/media-grid.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchTrendingQueryOptions } from "#/queries/trending.ts";
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
	const { data: trending } = useSuspenseQuery(
		fetchTrendingQueryOptions({
			data: { language: "en-US", media_type: "tv", time_window: "day" },
		})
	);

	const items: {
		href: string;
		id: string;
		mediaId: number;
		mediaType: "tv";
		image: string | null;
		overview: string;
		stat: { kind: "rating"; value: number };
		title: string;
		year: string;
	}[] = [];

	for (const item of trending.results) {
		if (item.media_type !== "tv") {
			continue;
		}
		items.push({
			href: `/tv/${item.id}`,
			id: `tv-${item.id}`,
			mediaId: item.id,
			mediaType: "tv",
			image: getPosterUrl(item.poster_path),
			overview: item.overview,
			stat: {
				kind: "rating",
				value: item.vote_average,
			},
			title: item.name,
			year: (item.first_air_date ?? "").slice(0, 4),
		});
	}

	return (
		<div className="flex flex-col">
			<MediaGrid items={items} title="Trending TV Shows" />
		</div>
	);
}
