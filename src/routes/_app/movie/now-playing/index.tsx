// oxlint-disable react/function-component-definition func-style
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchNowPlayingMovies } from "#/server/functions/movie.ts";
import { getPosterUrl } from "#/server/tmdb/images.ts";

export const Route = createFileRoute("/_app/movie/now-playing/")({
	component: NowPlayingMoviesPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description: "Now playing movies on CineFlux.",
			path: "/movie/now-playing",
			title: pageTitle("Now Playing Movies"),
		}),
});

function NowPlayingMoviesPage() {
	const query = useInfiniteQuery({
		queryKey: ["movies", "now-playing"],
		queryFn: async ({ pageParam = 1 }) => {
			return fetchNowPlayingMovies({
				data: { language: "en-US", page: pageParam },
			});
		},
		getNextPageParam: (lastPage) => {
			if (lastPage.page < lastPage.total_pages) {
				return lastPage.page + 1;
			}
			return undefined;
		},
		initialPageParam: 1,
	});

	const pages = query.pages;
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

	const observerRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (query.isFetching) return;
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
			observerRef.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && query.hasNextPage) {
						query.fetchNextPage();
					}
				},
				{ threshold: 0.1 }
			);
			if (node) {
				observerRef.current.observe(node);
			}
		},
		[query]
	);

	useEffect(() => {
		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	return (
		<div className="flex flex-col">
			<MediaRow
				items={items}
				title="Now Playing"
				href="/movie/now-playing"
			/>
			{query.hasNextPage && (
				<div className="mx-auto w-full max-w-7xl px-4 py-6 flex items-center justify-center">
					<button
						className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors"
						disabled={query.isFetching}
						onClick={() => query.fetchNextPage()}
					>
						{query.isFetching ? "Loading…" : "Load more"}
					</button>
					<div
						ref={observerRef}
						className="h-1 w-full"
						aria-hidden="true"
					/>
				</div>
			)}
		</div>
	);
}
