// oxlint-disable react/function-component-definition func-style
import { IconBookmark } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { MediaRow } from "#/components/media/media-row.tsx";
import type { RowItem } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { authClient } from "#/lib/auth-client.ts";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import { fetchMovieDetails } from "#/server/functions/movie.ts";
import { fetchPersonDetails } from "#/server/functions/person.ts";
import { fetchTvSeriesDetails } from "#/server/functions/tv.ts";
import { fetchWatchlist } from "#/server/functions/watchlist.ts";
import { getPosterUrl, getProfileUrl } from "#/server/tmdb/images.ts";

export const Route = createFileRoute("/_app/watchlist/")({
	head: () =>
		pageHead({
			description: "Your saved movies, TV shows, and people on CineFlux.",
			path: "/watchlist",
			title: pageTitle("My Watchlist"),
		}),
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

type SortKey = "recent" | "rating" | "title" | "year";

type WatchlistEntries = Awaited<ReturnType<typeof fetchWatchlist>>;

const sortItems = (items: RowItem[], sort: SortKey): RowItem[] => {
	if (sort === "rating") {
		// SAFETY: spread creates a fresh copy, so in-place sort cannot mutate cached query data.
		// oxlint-disable-next-line unicorn/no-array-sort
		return [...items].sort((a, b) => (b.stat?.value ?? 0) - (a.stat?.value ?? 0));
	}
	if (sort === "title") {
		// SAFETY: spread creates a fresh copy, so in-place sort cannot mutate cached query data.
		// oxlint-disable-next-line unicorn/no-array-sort
		return [...items].sort((a, b) => a.title.localeCompare(b.title));
	}
	if (sort === "year") {
		// SAFETY: spread creates a fresh copy, so in-place sort cannot mutate cached query data.
		// oxlint-disable-next-line unicorn/no-array-sort
		return [...items].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
	}
	return items;
};

function WatchlistPage() {
	const { data: session, isPending: sessionPending } = authClient.useSession();
	const queryClient = useQueryClient();
	const userId = session?.user.id ?? "";
	const [sort, setSort] = useState<SortKey>("recent");
	const { data: items, isPending: itemsPending } = useQuery({
		queryFn: async () => {
			const cached = queryClient.getQueryData<WatchlistEntries>([
				"watchlist",
				userId,
			]);
			const entries = cached ?? (await fetchWatchlist());
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
		queryKey: ["watchlist", userId, "detailed"],
		enabled: session !== null,
	});
	const rows = items ?? [];
	const movies = rows.filter((item) => item.mediaType === "movie");
	const shows = rows.filter((item) => item.mediaType === "tv");
	const people = rows.filter((item) => item.mediaType === "person");
	const sorted = useMemo(
		() => ({
			movies: sortItems(movies, sort),
			people: sortItems(people, sort),
			shows: sortItems(shows, sort),
		}),
		[movies, people, shows, sort]
	);

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
			<div className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
				<span className="bg-muted flex size-12 items-center justify-center rounded-full">
					<IconBookmark aria-hidden="true" className="size-6" />
				</span>
				<h2 className="mt-4 text-xl font-semibold">Nothing saved yet</h2>
				<p className="text-muted-foreground mt-1 max-w-sm text-sm">
					Tap the bookmark on any movie, show, or person to build your list.
				</p>
				<div className="mt-6 flex flex-wrap justify-center gap-2">
					<Link
						className="hover:bg-accent hover:text-accent-foreground flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors"
						to="/movie"
					>
						Browse movies
					</Link>
					<Link
						className="hover:bg-accent hover:text-accent-foreground flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors"
						to="/tv"
					>
						Browse TV shows
					</Link>
					<Link
						className="hover:bg-accent hover:text-accent-foreground flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors"
						to="/people"
					>
						Browse people
					</Link>
				</div>
			</div>
		);
	} else {
		body = (
			<>
				<Tabs
					onValueChange={(value) =>
						// SAFETY: the only triggers carry the sort values defined below.
						setSort(value as SortKey)
					}
					value={sort}
				>
					<TabsList variant="line">
						<TabsTrigger value="recent">Recently added</TabsTrigger>
						<TabsTrigger value="title">Title A–Z</TabsTrigger>
						<TabsTrigger value="rating">Top rated</TabsTrigger>
						<TabsTrigger value="year">Newest</TabsTrigger>
					</TabsList>
				</Tabs>
				{sorted.movies.length > 0 ? (
					<MediaRow items={sorted.movies} title="Movies" />
				) : null}
				{sorted.shows.length > 0 ? (
					<MediaRow items={sorted.shows} title="TV Shows" />
				) : null}
				{sorted.people.length > 0 ? (
					<MediaRow items={sorted.people} title="People" />
				) : null}
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
