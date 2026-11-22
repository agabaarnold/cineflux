// oxlint-disable react/function-component-definition func-style
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchUpcomingMoviesQueryOptions } from "#/queries/movie.ts";
import { getPosterUrl } from "#/server/tmdb/images.ts";

export const Route = createFileRoute("/_app/movie/upcoming/")({
	component: UpcomingMoviesPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description: "Upcoming movies on CineFlux.",
			path: "/movie/upcoming",
			title: pageTitle("Upcoming Movies"),
		}),
});

function UpcomingMoviesPage() {
	const [page, setPage] = useState(1);
	const { data, isFetching } = useSuspenseQuery(
		fetchUpcomingMoviesQueryOptions({
			data: { language: "en-US", page },
		})
	);

	const items = data.results.map((movie) => ({
		href: `/movie/${movie.id}`,
		id: `movie-${movie.id}`,
		mediaId: movie.id,
		mediaType: "movie" as const,
		image: getPosterUrl(movie.poster_path),
		overview: movie.overview,
		stat: {
			kind: "rating",
			value: movie.vote_average,
		} as const,
		title: movie.title,
		year: movie.release_date.slice(0, 4),
	}));

	const hasNextPage = page < data.total_pages;

	return (
		<div className="flex flex-col">
			<MediaRow items={items} title="Upcoming Movies" />
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
