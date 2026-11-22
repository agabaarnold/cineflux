// oxlint-disable react/function-component-definition func-style
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchTrendingQueryOptions } from "#/queries/trending.ts";
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
	const { data: trending } = useSuspenseQuery(
		fetchTrendingQueryOptions({
			data: { language: "en-US", media_type: "movie", time_window: "day" },
		})
	);

	const items: {
		href: string;
		id: string;
		mediaId: number;
		mediaType: "movie";
		image: string | null;
		overview: string;
		stat: { kind: "rating"; value: number };
		title: string;
		year: string;
	}[] = [];

	for (const item of trending.results) {
		if (item.media_type !== "movie") {
			continue;
		}
		items.push({
			href: `/movie/${item.id}`,
			id: `movie-${item.id}`,
			mediaId: item.id,
			mediaType: "movie",
			image: getPosterUrl(item.poster_path),
			overview: item.overview,
			stat: {
				kind: "rating",
				value: item.vote_average,
			},
			title: item.title,
			year: item.release_date.slice(0, 4),
		});
	}

	return (
		<div className="flex flex-col">
			<MediaRow items={items} title="Trending Movies" />
		</div>
	);
}
