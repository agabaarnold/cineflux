// oxlint-disable react/function-component-definition func-style
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

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

	return (
		<div className="flex flex-col">
			<MediaRow
				items={trending.results
					.filter((item) => item.media_type === "movie")
					.map((movie) => ({
						href: `/movie/${movie.id}`,
						id: `movie-${movie.id}`,
						mediaId: movie.id,
						mediaType: "movie",
						image: getPosterUrl(movie.poster_path),
						overview: movie.overview,
						stat: {
							kind: "rating",
							value: movie.vote_average,
						} as const,
						title: movie.title,
						year: movie.release_date.slice(0, 4),
					}))}
				title="Trending Movies"
			/>
		</div>
	);
}
