// oxlint-disable react/function-component-definition func-style
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { z } from "zod";

import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/ui/input-group.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { pageHead, pageTitle } from "#/lib/seo.ts";
import {
	searchMoviesQueryOptions,
	searchMultiQueryOptions,
	searchPeopleQueryOptions,
	searchTvShowsQueryOptions,
} from "#/queries/search.ts";
import type {
	SearchMoviesResults,
	SearchMultiResults,
	SearchPeopleResults,
	SearchTvResults,
} from "#/schemas/search.ts";
import type { TrendingAll } from "#/schemas/trending.ts";
import { getPosterUrl, getProfileUrl } from "#/server/tmdb/images.ts";

type SearchType = "all" | "movie" | "person" | "tv";

const MAX_RECENT_SEARCHES = 8;
const RECENT_SEARCHES_KEY = "cineflux:recent-searches";

const readRecentSearches = (): string[] => {
	try {
		const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
		if (!raw) {
			return [];
		}
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return [];
		}
		return parsed
			.filter((item): item is string => typeof item === "string")
			.slice(0, MAX_RECENT_SEARCHES);
	} catch {
		return [];
	}
};

function NoResults({ query }: { query: string }) {
	return (
		<p className="text-muted-foreground text-sm">
			No results for &ldquo;{query}&rdquo;.
		</p>
	);
}

function RecentSearches({
	onClear,
	onSelect,
	terms,
}: {
	onClear: () => void;
	onSelect: (term: string) => void;
	terms: string[];
}) {
	if (terms.length === 0) {
		return null;
	}
	return (
		<div className="mt-6">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-lg font-semibold">Recent searches</h2>
				<button
					className="text-muted-foreground hover:text-foreground text-xs transition-colors"
					onClick={onClear}
					type="button"
				>
					Clear
				</button>
			</div>
			<div className="flex flex-wrap gap-2">
				{terms.map((term) => (
					<button
						className="hover:bg-accent hover:text-accent-foreground flex h-9 items-center rounded-full border px-4 text-sm transition-colors"
						key={term}
						onClick={() => onSelect(term)}
						type="button"
					>
						{term}
					</button>
				))}
			</div>
		</div>
	);
}

function SearchFilters({
	onTypeChange,
	onYearChange,
	type,
	yearInput,
}: {
	onTypeChange: (type: SearchType) => void;
	onYearChange: (value: string) => void;
	type: SearchType;
	yearInput: string;
}) {
	return (
		<div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
			<Tabs
				onValueChange={(nextType) =>
					// SAFETY: the only triggers carry the search types defined below.
					onTypeChange(nextType as SearchType)
				}
				value={type}
			>
				<TabsList variant="line">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="movie">Movies</TabsTrigger>
					<TabsTrigger value="tv">TV Shows</TabsTrigger>
					<TabsTrigger value="person">People</TabsTrigger>
				</TabsList>
			</Tabs>
			<Input
				aria-label="Filter by release year"
				className="h-9 w-28"
				inputMode="numeric"
				max={2100}
				min={1800}
				onChange={(event) => onYearChange(event.target.value)}
				placeholder="Year"
				type="number"
				value={yearInput}
			/>
		</div>
	);
}

function MovieResults({
	items,
	query,
}: {
	items: SearchMoviesResults["results"];
	query: string;
}) {
	if (items.length === 0) {
		return <NoResults query={query} />;
	}
	return (
		<MediaRow
			items={items.slice(0, 20).map((movie) => ({
				href: `/movie/${movie.id}`,
				id: `movie-${movie.id}`,
				image: getPosterUrl(movie.poster_path),
				mediaId: movie.id,
				mediaType: "movie" as const,
				overview: movie.overview,
				stat: {
					kind: "rating",
					value: movie.vote_average,
				} as const,
				title: movie.title,
				year: movie.release_date.slice(0, 4),
			}))}
			title="Movies"
		/>
	);
}

function TvResults({
	items,
	query,
}: {
	items: SearchTvResults["results"];
	query: string;
}) {
	if (items.length === 0) {
		return <NoResults query={query} />;
	}
	return (
		<MediaRow
			items={items.slice(0, 20).map((show) => ({
				href: `/tv/${show.id}`,
				id: `tv-${show.id}`,
				image: getPosterUrl(show.poster_path),
				mediaId: show.id,
				mediaType: "tv" as const,
				overview: show.overview,
				stat: {
					kind: "rating",
					value: show.vote_average,
				} as const,
				title: show.name,
				year: (show.first_air_date ?? "").slice(0, 4),
			}))}
			title="TV Shows"
		/>
	);
}

function PersonResults({
	items,
	query,
}: {
	items: SearchPeopleResults["results"];
	query: string;
}) {
	if (items.length === 0) {
		return <NoResults query={query} />;
	}
	return (
		<MediaRow
			items={items.slice(0, 20).map((person) => ({
				href: `/person/${person.id}`,
				id: `person-${person.id}`,
				image: getProfileUrl(person.profile_path),
				mediaId: person.id,
				mediaType: "person" as const,
				overview: "",
				stat: {
					kind: "popularity",
					value: person.popularity,
				} as const,
				title: person.name,
				year: person.known_for_department ?? "",
			}))}
			title="People"
		/>
	);
}

function useTypedSearch(
	query: string,
	type: SearchType,
	year: number | undefined
) {
	const base = {
		language: "en-US",
		page: 1,
		query: query === "" ? " " : query,
	};
	const multiQuery = useQuery({
		...searchMultiQueryOptions({ data: base }),
		enabled: query !== "" && type === "all",
	});
	const movieQuery = useQuery({
		...searchMoviesQueryOptions({ data: { ...base, year } }),
		enabled: query !== "" && type === "movie",
	});
	const tvQuery = useQuery({
		...searchTvShowsQueryOptions({ data: { ...base, year } }),
		enabled: query !== "" && type === "tv",
	});
	const personQuery = useQuery({
		...searchPeopleQueryOptions({ data: base }),
		enabled: query !== "" && type === "person",
	});
	const { data: movieData, isPending: moviePending } = movieQuery;
	const { data: multiData, isPending: multiPending } = multiQuery;
	const { data: personData, isPending: personPending } = personQuery;
	const { data: tvData, isPending: tvPending } = tvQuery;
	let isPending = multiPending;
	if (type === "movie") {
		isPending = moviePending;
	} else if (type === "tv") {
		isPending = tvPending;
	} else if (type === "person") {
		isPending = personPending;
	}
	return {
		isPending,
		movieResults: movieData?.results ?? [],
		multiResults: multiData?.results ?? [],
		personResults: personData?.results ?? [],
		showResults: tvData?.results ?? [],
	};
}

function GroupedResults({
	items,
	query,
	year,
}: {
	items: SearchMultiResults["results"];
	query: string;
	year: string | undefined;
}) {
	const inYear = (date: string | null | undefined): boolean =>
		year === undefined || (date ?? "").slice(0, 4) === year;
	const movies = items.filter(
		(item): item is MultiMovie =>
			item.media_type === "movie" && inYear(item.release_date)
	);
	const shows = items.filter(
		(item): item is MultiTv =>
			item.media_type === "tv" && inYear(item.first_air_date)
	);
	const people = items.filter(
		(item): item is MultiPerson => item.media_type === "person"
	);
	if (movies.length === 0 && shows.length === 0 && people.length === 0) {
		return <NoResults query={query} />;
	}
	return (
		<>
			{movies.length > 0 ? (
				<MediaRow
					items={movies.slice(0, 10).map((movie) => ({
						href: `/movie/${movie.id}`,
						id: String(movie.id),
						mediaId: movie.id,
						image: getPosterUrl(movie.poster_path),
						mediaType: "movie",
						overview: movie.overview,
						stat: {
							kind: "rating",
							value: movie.vote_average,
						} as const,
						title: movie.title,
						year: movie.release_date.slice(0, 4),
					}))}
					title="Movies"
				/>
			) : null}

			{shows.length > 0 ? (
				<MediaRow
					items={shows.slice(0, 10).map((show) => ({
						href: `/tv/${show.id}`,
						id: String(show.id),
						mediaId: show.id,
						image: getPosterUrl(show.poster_path),
						mediaType: "tv",
						overview: show.overview,
						stat: {
							kind: "rating",
							value: show.vote_average,
						} as const,
						title: show.name,
						year: (show.first_air_date ?? "").slice(0, 4),
					}))}
					title="TV Shows"
				/>
			) : null}

			{people.length > 0 ? (
				<MediaRow
					items={people.slice(0, 10).map((person) => ({
						href: `/person/${person.id}`,
						id: String(person.id),
						mediaId: person.id,
						image: getProfileUrl(person.profile_path),
						mediaType: "person",
						overview: person.known_for?.[0]?.overview ?? "",
						stat: {
							kind: "popularity",
							value: person.popularity,
						} as const,
						title: person.name,
						year: person.known_for_department ?? "",
					}))}
					title="People"
				/>
			) : null}
		</>
	);
}

export const Route = createFileRoute("/_app/search/")({
	validateSearch: z.object({
		query: z.string().default(""),
		type: z.enum(["all", "movie", "person", "tv"]).default("all"),
		year: z.preprocess(
			(value) => (/^\d{4}$/u.test(String(value)) ? String(value) : undefined),
			z.string().optional()
		),
	}),
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) => {
		const query = deps.query.trim();
		if (!query) {
			return null;
		}
		const base = { language: "en-US", page: 1, query };
		const year = deps.year === undefined ? undefined : Number(deps.year);
		if (deps.type === "movie") {
			return context.queryClient.query(
				searchMoviesQueryOptions({ data: { ...base, year } })
			);
		}
		if (deps.type === "tv") {
			return context.queryClient.query(
				searchTvShowsQueryOptions({ data: { ...base, year } })
			);
		}
		if (deps.type === "person") {
			return context.queryClient.query(
				searchPeopleQueryOptions({ data: base })
			);
		}
		return context.queryClient.query(searchMultiQueryOptions({ data: base }));
	},
	component: SearchPage,
	errorComponent: RouteError,
	head: () =>
		pageHead({
			description: "Search movies, TV shows, and people on CineFlux.",
			path: "/search",
			title: pageTitle("Search"),
		}),
});

type MultiMovie = Extract<TrendingAll, { media_type: "movie" }>;
type MultiTv = Extract<TrendingAll, { media_type: "tv" }>;
type MultiPerson = Extract<TrendingAll, { media_type: "person" }>;

function SearchPage() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const [value, setValue] = useState(search.query);
	const [yearInput, setYearInput] = useState(search.year ?? "");
	const [recent, setRecent] = useState<string[]>([]);

	useEffect(() => {
		const syncFromUrl = () => {
			setValue(search.query);
			setYearInput(search.year ?? "");
		};
		syncFromUrl();
	}, [search.query, search.year]);

	const recordRecent = useCallback((term: string) => {
		setRecent((previous) => {
			const next = [term, ...previous.filter((item) => item !== term)].slice(
				0,
				MAX_RECENT_SEARCHES
			);
			try {
				localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
			} catch {
				// Storage may be unavailable; the list simply won't persist.
			}
			return next;
		});
	}, []);

	useEffect(() => {
		const trimmed = value.trim();
		if (trimmed === search.query) {
			return;
		}
		const handle = setTimeout(() => {
			navigate({
				search: { query: trimmed, type: search.type, year: search.year },
				to: ".",
			});
			recordRecent(trimmed);
		}, 400);
		return () => clearTimeout(handle);
	}, [value, search, navigate, recordRecent]);

	// SAFETY: localStorage only exists in the browser; effects never run on the server.
	useEffect(() => {
		// oxlint-disable-next-line react/set-state-in-effect
		setRecent(readRecentSearches());
	}, []);

	const clearRecents = () => {
		setRecent([]);
		try {
			localStorage.removeItem(RECENT_SEARCHES_KEY);
		} catch {
			// Storage may be unavailable; nothing to clear.
		}
	};

	const query = search.query.trim();
	const { type } = search;
	const yearNumber =
		search.year === undefined ? undefined : Number(search.year);
	const { isPending, movieResults, multiResults, personResults, showResults } =
		useTypedSearch(query, type, yearNumber);

	let body: ReactNode;
	if (query === "") {
		body = (
			<>
				<p className="text-muted-foreground text-sm">
					Type to search across movies, TV shows, and people.
				</p>
				<RecentSearches
					onClear={clearRecents}
					onSelect={setValue}
					terms={recent}
				/>
			</>
		);
	} else if (isPending) {
		body = (
			<p className="text-muted-foreground text-sm">
				Searching for &ldquo;{query}&rdquo;…
			</p>
		);
	} else if (type === "movie") {
		body = <MovieResults items={movieResults} query={query} />;
	} else if (type === "tv") {
		body = <TvResults items={showResults} query={query} />;
	} else if (type === "person") {
		body = <PersonResults items={personResults} query={query} />;
	} else {
		body = (
			<GroupedResults items={multiResults} query={query} year={search.year} />
		);
	}

	return (
		<div className="mx-auto w-full max-w-7xl space-y-10 px-4 pt-24 pb-6">
			<div>
				<h1 className="text-3xl font-bold">Search</h1>
				<p className="text-muted-foreground mt-1">
					Movies, TV shows, and people.
				</p>
			</div>

			<search className="block max-w-xl">
				<InputGroup>
					<InputGroupAddon>
						<IconSearch aria-hidden="true" />
					</InputGroupAddon>
					<InputGroupInput
						aria-label="Search movies, TV shows, and people"
						onChange={(event) => setValue(event.target.value)}
						placeholder="Search titles or people…"
						type="text"
						value={value}
					/>
				</InputGroup>
			</search>

			<SearchFilters
				onTypeChange={(nextType) =>
					navigate({
						search: { query: search.query, type: nextType, year: search.year },
						to: ".",
					})
				}
				onYearChange={(next) => {
					setYearInput(next);
					if (next === "" || /^\d{4}$/u.test(next)) {
						navigate({
							search: {
								query: search.query,
								type: search.type,
								year: next === "" ? undefined : next,
							},
							to: ".",
						});
					}
				}}
				type={search.type}
				yearInput={yearInput}
			/>

			{body}
		</div>
	);
}
