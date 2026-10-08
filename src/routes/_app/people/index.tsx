// oxlint-disable react/function-component-definition func-style
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { fetchPopularPeopleQueryOptions } from "#/queries/person.ts";
import { fetchTrendingQueryOptions } from "#/queries/trending.ts";
import { timeWindowSchema } from "#/schemas/common.ts";
import type { TrendingAll } from "#/schemas/trending.ts";
import { getProfileUrl } from "#/server/tmdb/images.ts";

const popularPeopleOptions = fetchPopularPeopleQueryOptions({
	data: { language: "en-US", page: 1 },
});

export const Route = createFileRoute("/_app/people/")({
	validateSearch: z.object({ time_window: timeWindowSchema.default("day") }),
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) =>
		Promise.all([
			context.queryClient.query({
				...fetchTrendingQueryOptions({
					data: {
						language: "en-US",
						media_type: "person",
						time_window: deps.time_window,
					},
				}),
				staleTime: "static",
			}),
			context.queryClient.query({
				...popularPeopleOptions,
				staleTime: "static",
			}),
		]),
	component: PeoplePage,
	errorComponent: RouteError,
});

function PeoplePage() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const trendingOptions = fetchTrendingQueryOptions({
		data: {
			language: "en-US",
			media_type: "person",
			time_window: search.time_window,
		},
	});
	const { data: trending } = useSuspenseQuery(trendingOptions);
	const { data: popular } = useSuspenseQuery(popularPeopleOptions);

	type TrendingPerson = Extract<TrendingAll, { media_type: "person" }>;
	const trendingPeople = trending.results.filter(
		(item): item is TrendingPerson => item.media_type === "person"
	);

	return (
		<div className="mx-auto w-full max-w-7xl space-y-10 px-4 pt-24 pb-6">
			<div>
				<h1 className="text-3xl font-bold">People</h1>
				<p className="text-muted-foreground mt-1">
					Trending actors, directors, and creators.
				</p>
			</div>

			<div>
				<div className="mb-3 flex items-center justify-between">
					<h2 className="text-2xl font-semibold">Trending people</h2>
					<Tabs
						onValueChange={(value) =>
							navigate({
								search: {
									// SAFETY: the only triggers carry "day" and "week" values defined below.
									time_window: value as "day" | "week",
								},
								to: ".",
							})
						}
						value={search.time_window}
					>
						<TabsList variant="line">
							<TabsTrigger value="day">Day</TabsTrigger>
							<TabsTrigger value="week">Week</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<MediaRow
					items={trendingPeople.slice(0, 10).map((person) => ({
						href: `/person/${person.id}`,
						id: `person-${person.id}`,
						image: getProfileUrl(person.profile_path),
						mediaId: person.id,
						mediaType: "person",
						overview: person.known_for?.[0]?.overview ?? "",
						stat: { kind: "popularity", value: person.popularity } as const,
						title: person.name,
						year: person.known_for_department ?? "",
					}))}
					title=""
				/>
			</div>

			<MediaRow
				items={popular.results.slice(0, 10).map((person) => ({
					href: `/person/${person.id}`,
					id: String(person.id),
					mediaId: person.id,
					image: getProfileUrl(person.profile_path),
					mediaType: "person",
					overview: person.known_for?.[0]?.overview ?? "",
					stat: { kind: "popularity", value: person.popularity } as const,
					title: person.name,
					year: person.known_for_department ?? "",
				}))}
				title="Popular people"
			/>
		</div>
	);
}
