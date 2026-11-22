// oxlint-disable react/function-component-definition func-style
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MediaGrid } from "#/components/media/media-grid.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchUpcomingMovies } from "#/server/functions/movie.ts";
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
	const query = useInfiniteQuery({
		queryKey: ["movies", "upcoming"],
		queryFn: ({ pageParam = 1 }) =>
			fetchUpcomingMovies({
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
		page.results.map((movie) => ({
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
		}))
	);

	return (
		<div className="flex flex-col space-y-6">
			<MediaGrid items={items} title="Upcoming Movies" gap="gap-2" />
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
