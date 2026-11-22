// oxlint-disable react/function-component-definition func-style
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MediaGridSkeleton } from "#/components/media/media-grid-skeleton.tsx";
import { MediaGrid } from "#/components/media/media-grid.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchPopularMovies } from "#/server/functions/movie.ts";
import { getPosterUrl } from "#/server/tmdb/images.ts";

export const Route = createFileRoute("/_app/movie/popular/")({
	component: PopularMoviesPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description: "Popular movies on CineFlux.",
			path: "/movie/popular",
			title: pageTitle("Popular Movies"),
		}),
});

function PopularMoviesPage() {
	const query = useInfiniteQuery({
		queryKey: ["movies", "popular"],
		queryFn: ({ pageParam = 1 }) =>
			fetchPopularMovies({
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
			{query.isPending ? (
				<MediaGridSkeleton title="Popular Movies" gap="gap-3" />
			) : (
				<MediaGrid items={items} title="Popular Movies" gap="gap-3" />
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
