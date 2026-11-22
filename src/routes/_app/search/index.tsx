// oxlint-disable react/function-component-definition func-style react/set-state-in-effect
import { IconSearch, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { z } from "zod";

import { MediaRowSkeleton } from "#/components/media/media-row-skeleton.tsx";
import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupButton,
} from "#/components/ui/input-group.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { useDebounce } from "#/hooks/use-debounce.ts";
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
		<div className="rounded-2xl border border-dashed px-6 py-16 text-center">
			<h2 className="text-xl font-semibold">No results found</h2>
			<p className="text-muted-foreground mt-1 text-sm">
				No matches for &ldquo;{query}&rdquo;. Try another title or name.
			</p>
		</div>
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
					className="text-muted-foreground hover:text-foreground min-h-11 px-2 text-xs transition-colors"
					onClick={onClear}
					type="button"
				>
					Clear
				</button>
			</div>
			<div className="flex flex-wrap gap-2">
				{terms.map((term) => (
					<button
						className="hover:bg-accent hover:text-accent-foreground flex h-11 items-center rounded-full border px-4 text-sm transition-colors"
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
		<div className="mt-4 flex flex-col items-start gap-x-4 gap-y-3 sm:flex-row sm:items-center">
			<Tabs
				onValueChange={(nextType) =>
					// SAFETY: the only triggers carry the search types defined below.
					onTypeChange(nextType as SearchType)
				}
				value={type}
				className="w-full sm:w-auto"
			>
				<TabsList variant="line" className="w-full sm:w-auto">
					<TabsTrigger
						value="all"
						className="w-full text-center sm:w-auto sm:text-left"
					>
						All
					</TabsTrigger>
					<TabsTrigger
						value="movie"
						className="w-full text-center sm:w-auto sm:text-left"
					>
						Movies
					</TabsTrigger>
					<TabsTrigger
						value="tv"
						className="w-full text-center sm:w-auto sm:text-left"
					>
						TV Shows
					</TabsTrigger>
					<TabsTrigger
						value="person"
						className="w-full text-center sm:w-auto sm:text-left"
					>
						People
					</TabsTrigger>
				</TabsList>
			</Tabs>
			<Input
				aria-label="Filter by release year"
				className="h-11 w-full sm:w-28"
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
	const debouncedValue = useDebounce(value, 400);
	const isComposing = useRef(false);

	useEffect(() => {
		const syncFromUrl = () => {
			// oxlint-disable-next-line react/set-state-in-effect
			setValue(search.query);
			// oxlint-disable-next-line react/set-state-in-effect
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
		const trimmed = debouncedValue.trim();
		if (trimmed === search.query) {
			return;
		}
		navigate({
			search: { query: trimmed, type: search.type, year: search.year },
			to: ".",
		});
		if (trimmed) {
			recordRecent(trimmed);
		}
	}, [debouncedValue, search, navigate, recordRecent]);

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
	const isDebouncing = value.trim() !== search.query.trim();

	const submitSearch = () => {
		const trimmed = value.trim();
		navigate({
			search: { query: trimmed, type: search.type, year: search.year },
			to: ".",
		});
		if (trimmed) {
			recordRecent(trimmed);
		}
	};

	const clearSearch = () => {
		setValue("");
		navigate({
			search: { query: "", type: search.type, year: search.year },
			to: ".",
		});
	};

	let body: ReactNode;
	if (query === "" && value.trim() === "") {
		body = (
			<RecentSearches
				onClear={clearRecents}
				onSelect={setValue}
				terms={recent}
			/>
		);
	} else if (isDebouncing || isPending) {
		let loadingTitle = "People";
		if (type === "movie") {
			loadingTitle = "Movies";
		} else if (type === "tv") {
			loadingTitle = "TV Shows";
		}
		body = (
			<div aria-live="polite">
				<span className="sr-only">
					Searching for &ldquo;{value.trim()}&rdquo;
				</span>
				{type === "all" ? (
					<div className="space-y-8">
						<MediaRowSkeleton title="Movies" />
						<MediaRowSkeleton title="TV Shows" />
						<MediaRowSkeleton title="People" />
					</div>
				) : (
					<MediaRowSkeleton title={loadingTitle} />
				)}
			</div>
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

			<search className="block w-full sm:max-w-xl">
				<form
					onSubmit={(event) => {
						event.preventDefault();
						submitSearch();
					}}
				>
					<InputGroup className="h-12">
						<InputGroupAddon>
							<IconSearch aria-hidden="true" />
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search movies, TV shows, and people"
							autoFocus
							onChange={(event) => setValue(event.target.value)}
							onCompositionEnd={() => {
								isComposing.current = false;
							}}
							onCompositionStart={() => {
								isComposing.current = true;
							}}
							onKeyDown={(event) => {
								if (event.key === "Enter" && isComposing.current) {
									event.preventDefault();
								}
							}}
							placeholder="Search titles or people…"
							type="search"
							value={value}
						/>
						{value ? (
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									aria-label="Clear search"
									onClick={clearSearch}
									size="icon-sm"
								>
									<IconX aria-hidden="true" />
								</InputGroupButton>
							</InputGroupAddon>
						) : null}
					</InputGroup>
				</form>
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
