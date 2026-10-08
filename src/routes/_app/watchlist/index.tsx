// oxlint-disable react/function-component-definition func-style
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { MediaRow } from "#/components/media/media-row.tsx";
import type { RowItem } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { authClient } from "#/lib/auth-client.ts";
import { fetchMovieDetails } from "#/server/functions/movie.ts";
import { fetchPersonDetails } from "#/server/functions/person.ts";
import { fetchTvSeriesDetails } from "#/server/functions/tv.ts";
import { fetchWatchlist } from "#/server/functions/watchlist.ts";
import { getPosterUrl, getProfileUrl } from "#/server/tmdb/images.ts";

export const Route = createFileRoute("/_app/watchlist/")({
	component: WatchlistPage,
	errorComponent: RouteError,
});

const toRowItem = (
	entry:
		| {
				kind: "movie";
				id: number;
				image: string | null;
				overview: string;
				title: string;
				year: string;
				rating: number;
		  }
		| {
				kind: "tv";
				id: number;
				image: string | null;
				overview: string;
				title: string;
				year: string;
				rating: number;
		  }
		| {
				kind: "person";
				id: number;
				image: string | null;
				title: string;
				year: string;
				popularity: number;
		  }
): RowItem => {
	if (entry.kind === "person") {
		return {
			href: `/person/${entry.id}`,
			id: `person-${entry.id}`,
			image: entry.image,
			mediaId: entry.id,
			mediaType: "person",
			overview: "",
			stat: { kind: "popularity", value: entry.popularity } as const,
			title: entry.title,
			year: entry.year,
		};
	}
	return {
		href: `/${entry.kind}/${entry.id}`,
		id: `${entry.kind}-${entry.id}`,
		image: entry.image,
		mediaId: entry.id,
		mediaType: entry.kind,
		overview: entry.overview,
		stat: { kind: "rating", value: entry.rating } as const,
		title: entry.title,
		year: entry.year,
	};
};

function WatchlistPage() {
	const { data: session, isPending: sessionPending } = authClient.useSession();
	const { data: items, isPending: itemsPending } = useQuery({
		queryFn: async () => {
			const entries = await fetchWatchlist();
			const settled = await Promise.allSettled(
				entries.map(async (entry) => {
					if (entry.mediaType === "movie") {
						const details = await fetchMovieDetails({
							data: { id: entry.mediaId, language: "en-US" },
						});
						return {
							kind: "movie" as const,
							id: details.id,
							image: getPosterUrl(details.poster_path),
							overview: details.overview,
							rating: details.vote_average,
							title: details.title,
							year: details.release_date.slice(0, 4),
						};
					}
					if (entry.mediaType === "tv") {
						const details = await fetchTvSeriesDetails({
							data: { id: entry.mediaId, language: "en-US" },
						});
						return {
							kind: "tv" as const,
							id: details.id,
							image: getPosterUrl(details.poster_path),
							overview: details.overview,
							rating: details.vote_average,
							title: details.name,
							year: (details.first_air_date ?? "").slice(0, 4),
						};
					}
					const details = await fetchPersonDetails({
						data: { id: entry.mediaId, language: "en-US" },
					});
					return {
						kind: "person" as const,
						id: details.id,
						image: getProfileUrl(details.profile_path),
						popularity: details.popularity,
						title: details.name,
						year: details.known_for_department,
					};
				})
			);
			return settled.flatMap((result) =>
				result.status === "fulfilled" ? [toRowItem(result.value)] : []
			);
		},
		queryKey: ["watchlist", session?.user.id ?? "", "detailed"],
		enabled: session !== null,
	});

	if (!sessionPending && !session) {
		return (
			<div className="mx-auto flex w-full max-w-7xl flex-col items-start px-4 pt-24 pb-6">
				<h1 className="text-3xl font-bold">My watchlist</h1>
				<p className="text-muted-foreground mt-1">
					Sign in to save movies, shows, and people.
				</p>
				<Link
					className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors"
					to="/sign-in"
				>
					Sign in
				</Link>
			</div>
		);
	}

	const rows = items ?? [];
	const movies = rows.filter((item) => item.mediaType === "movie");
	const shows = rows.filter((item) => item.mediaType === "tv");
	const people = rows.filter((item) => item.mediaType === "person");

	const unit = rows.length === 1 ? "title" : "titles";
	const summary =
		rows.length === 0
			? "Everything you save lives here."
			: `${rows.length} saved ${unit}.`;

	let body: ReactNode;
	if (itemsPending) {
		body = <p className="text-muted-foreground text-sm">Loading your list…</p>;
	} else if (rows.length === 0) {
		body = (
			<p className="text-muted-foreground text-sm">
				Nothing saved yet. Tap the bookmark on any title to add it here.
			</p>
		);
	} else {
		body = (
			<>
				{movies.length > 0 ? <MediaRow items={movies} title="Movies" /> : null}
				{shows.length > 0 ? <MediaRow items={shows} title="TV Shows" /> : null}
				{people.length > 0 ? <MediaRow items={people} title="People" /> : null}
			</>
		);
	}

	return (
		<div className="mx-auto w-full max-w-7xl space-y-10 px-4 pt-24 pb-6">
			<div>
				<h1 className="text-3xl font-bold">My watchlist</h1>
				<p className="text-muted-foreground mt-1">{summary}</p>
			</div>

			{body}
		</div>
	);
}
