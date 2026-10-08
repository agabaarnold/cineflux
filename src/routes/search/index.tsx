// oxlint-disable react/function-component-definition func-style
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { z } from "zod";

import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/ui/input-group.tsx";
import { searchMultiQueryOptions } from "#/queries/search.ts";
import type { TrendingAll } from "#/schemas/trending.ts";
import { getPosterUrl, getProfileUrl } from "#/server/tmdb/images.ts";

const searchOptions = (query: string) =>
	searchMultiQueryOptions({
		data: { language: "en-US", page: 1, query },
	});

export const Route = createFileRoute("/search/")({
	validateSearch: z.object({ query: z.string().default("") }),
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) => {
		const query = deps.query.trim();
		if (!query) {
			return null;
		}
		return context.queryClient.query(searchOptions(query));
	},
	component: SearchPage,
	errorComponent: RouteError,
});

type MultiMovie = Extract<TrendingAll, { media_type: "movie" }>;
type MultiTv = Extract<TrendingAll, { media_type: "tv" }>;
type MultiPerson = Extract<TrendingAll, { media_type: "person" }>;

function SearchPage() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const [value, setValue] = useState(search.query);

	useEffect(() => {
		const syncFromUrl = () => {
			setValue(search.query);
		};
		syncFromUrl();
	}, [search.query]);

	useEffect(() => {
		const trimmed = value.trim();
		if (trimmed === search.query) {
			return;
		}
		const handle = setTimeout(() => {
			navigate({ search: { query: trimmed }, to: "." });
		}, 400);
		return () => clearTimeout(handle);
	}, [value, search.query, navigate]);

	const query = search.query.trim();
	const { data, isPending } = useQuery({
		...searchOptions(query === "" ? " " : query),
		enabled: query !== "",
	});

	const results = data?.results ?? [];
	const movies = results.filter(
		(item): item is MultiMovie => item.media_type === "movie"
	);
	const shows = results.filter(
		(item): item is MultiTv => item.media_type === "tv"
	);
	const people = results.filter(
		(item): item is MultiPerson => item.media_type === "person"
	);
	const hasResults = movies.length > 0 || shows.length > 0 || people.length > 0;

	let body: ReactNode;
	if (query === "") {
		body = (
			<p className="text-muted-foreground text-sm">
				Type to search across movies, TV shows, and people.
			</p>
		);
	} else if (isPending) {
		body = (
			<p className="text-muted-foreground text-sm">
				Searching for &ldquo;{query}&rdquo;…
			</p>
		);
	} else if (hasResults) {
		body = (
			<>
				{movies.length > 0 ? (
					<MediaRow
						items={movies.slice(0, 10).map((movie) => ({
							href: `/movie/${movie.id}`,
							id: String(movie.id),
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
	} else {
		body = (
			<p className="text-muted-foreground text-sm">
				No results for &ldquo;{query}&rdquo;.
			</p>
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

			{body}
		</div>
	);
}
