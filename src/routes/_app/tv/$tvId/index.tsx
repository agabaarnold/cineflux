// oxlint-disable react/function-component-definition func-style
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";

import { CastRow } from "#/components/media/cast-row.tsx";
import { DetailHero } from "#/components/media/detail-hero.tsx";
import type { DetailHeroMeta } from "#/components/media/detail-hero.tsx";
import {
	detailValue,
	formatFullDate,
	getCrewGroups,
	getTrailerKey,
	InfoRows,
	ReviewsList,
} from "#/components/media/detail-sections.tsx";
import type { ReviewItem } from "#/components/media/detail-sections.tsx";
import { MediaRow } from "#/components/media/media-row.tsx";
import { WatchProviders } from "#/components/media/watch-providers.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "#/components/ui/tabs.tsx";
import { pageHead, pageTitle, truncateDescription } from "#/lib/seo.ts";
import {
	fetchTvContentRatingsQueryOptions,
	fetchTvSeriesDetailsQueryOptions,
	fetchTvWatchProvidersQueryOptions,
} from "#/queries/tv.ts";
import type {
	TvContentRatings,
	TVSeriesDetailsWithAppend,
} from "#/schemas/tv.ts";
import {
	getBackdropUrl,
	getPosterUrl,
	getProfileUrl,
} from "#/server/tmdb/images.ts";

const APPEND_TO_RESPONSE = [
	"credits",
	"videos",
	"similar",
	"reviews",
	"recommendations",
] as const;

const detailOptions = (id: number) =>
	fetchTvSeriesDetailsQueryOptions({
		data: {
			append_to_response: [...APPEND_TO_RESPONSE],
			id,
			language: "en-US",
		},
	});

const contentRatingsOptions = (id: number) =>
	fetchTvContentRatingsQueryOptions({ data: { id } });

const providersOptions = (id: number) =>
	fetchTvWatchProvidersQueryOptions({ data: { id } });

const parseId = (value: string) => {
	const id = Number(value);
	if (!Number.isSafeInteger(id) || id <= 0) {
		throw notFound();
	}
	return id;
};

export const Route = createFileRoute("/_app/tv/$tvId/")({
	loader: ({ context, params }) => {
		const id = parseId(params.tvId);
		return Promise.all([
			context.queryClient.query({
				...detailOptions(id),
				staleTime: "static",
			}),
			context.queryClient.query({
				...contentRatingsOptions(id),
				staleTime: "static",
			}),
			context.queryClient.query(providersOptions(id)),
		]);
	},
	component: TvDetailsPage,
	errorComponent: RouteError,
	head: ({ loaderData, params }) => {
		const [details] = loaderData ?? [];
		if (!details) {
			return pageHead({
				description: "TV show details, cast, and reviews on CineFlux.",
				path: `/tv/${params.tvId}`,
				title: pageTitle("TV Show"),
			});
		}
		const year = (details.first_air_date ?? "").slice(0, 4);
		const name = year ? `${details.name} (${year})` : details.name;
		return pageHead({
			description: truncateDescription(
				details.overview,
				`${name} — details, cast, reviews, and where to watch on CineFlux.`
			),
			image:
				getPosterUrl(details.poster_path, "w780") ??
				getBackdropUrl(details.backdrop_path),
			path: `/tv/${details.id}`,
			title: pageTitle(name),
		});
	},
});

const getUsTvRating = (ratings: TvContentRatings): string =>
	ratings.results.find((entry) => entry.iso_3166_1 === "US")?.rating ?? "";

const getSimilarShows = (details: TVSeriesDetailsWithAppend) => {
	if ((details.similar?.results.length ?? 0) > 0) {
		return details.similar?.results ?? [];
	}
	return details.recommendations?.results ?? [];
};

const getTvByline = (
	createdBy: { name: string }[],
	directors: string[]
): string | undefined => {
	if (createdBy.length > 0) {
		return `Created by ${createdBy.map((person) => person.name).join(", ")}`;
	}
	if (directors.length > 0) {
		return `By ${directors.join(", ")}`;
	}
	return undefined;
};

const getSeasonsLabel = (seasons: number, episodes: number): string => {
	if (seasons <= 0 && episodes <= 0) {
		return "";
	}
	const seasonUnit = seasons === 1 ? "Season" : "Seasons";
	const episodeUnit = episodes === 1 ? "Episode" : "Episodes";
	return `${seasons} ${seasonUnit} · ${episodes} ${episodeUnit}`;
};

const getTvMeta = (details: TVSeriesDetailsWithAppend): DetailHeroMeta[] => {
	const meta: DetailHeroMeta[] = [];
	if (details.first_air_date) {
		meta.push({
			icon: "date",
			label: "First air date",
			value: formatFullDate(details.first_air_date),
		});
	}
	const seasonsLabel = getSeasonsLabel(
		details.number_of_seasons,
		details.number_of_episodes
	);
	if (seasonsLabel) {
		meta.push({ icon: "info", label: "Seasons", value: seasonsLabel });
	}
	const [firstRuntime] = details.episode_run_time;
	if (firstRuntime) {
		meta.push({
			icon: "runtime",
			label: "Episode runtime",
			value: `~${firstRuntime}m per episode`,
		});
	}
	if (details.original_language) {
		meta.push({
			icon: "language",
			label: "Original language",
			value: details.original_language.toUpperCase(),
		});
	}
	const [originCountry] = details.origin_country;
	if (originCountry) {
		meta.push({
			icon: "country",
			label: "Origin country",
			value: details.origin_country.join(", "),
		});
	}
	return meta;
};

function TvDetailsPage() {
	const { tvId } = Route.useParams();
	const id = parseId(tvId);
	const { data: details } = useSuspenseQuery(detailOptions(id));
	const { data: contentRatings } = useSuspenseQuery(contentRatingsOptions(id));
	const { data: providers } = useSuspenseQuery(providersOptions(id));
	const [tab, setTab] = useState("information");

	const crew = getCrewGroups(details.credits?.crew);
	const certification = getUsTvRating(contentRatings);
	const trailerKey = getTrailerKey(details.videos);
	const similar = getSimilarShows(details);
	const reviews: ReviewItem[] = (details.reviews?.results ?? [])
		.slice(0, 5)
		.map((review) => ({
			author: review.author_details.username || review.author,
			content: review.content,
			date: review.created_at.slice(0, 10),
			id: review.id,
			rating: review.author_details.rating,
			url: review.url,
		}));

	return (
		<div className="flex flex-col">
			<DetailHero
				backdrop={getBackdropUrl(details.backdrop_path, "w1280")}
				byline={getTvByline(details.created_by, crew.directors)}
				genres={details.genres}
				meta={getTvMeta(details)}
				mediaId={id}
				mediaType="tv"
				overview={details.overview}
				poster={getPosterUrl(details.poster_path)}
				sectionHref="/tv"
				sectionLabel="TV Shows"
				tagline={details.tagline}
				title={details.name}
				trailerUrl={
					trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : null
				}
				voteAverage={details.vote_average}
				voteCount={details.vote_count ?? 0}
				year={(details.first_air_date ?? "").slice(0, 4)}
			/>

			<div className="mx-auto w-full max-w-7xl px-4 py-6">
				<Tabs onValueChange={setTab} value={tab}>
					<TabsList variant="line">
						<TabsTrigger value="information">Information</TabsTrigger>
						<TabsTrigger value="reviews">
							Reviews{reviews.length > 0 ? ` (${reviews.length})` : ""}
						</TabsTrigger>
						<TabsTrigger value="similar">Similar TV Shows</TabsTrigger>
					</TabsList>

					<TabsContent className="mt-4" value="information">
						<h2 className="text-xl font-semibold">Information</h2>
						<InfoRows
							rows={[
								{
									label: "Creator(s)",
									value: detailValue(
										details.created_by.map((person) => person.name).join(", ")
									),
								},
								{
									label: "Genre(s)",
									value: detailValue(
										details.genres.map((genre) => genre.name).join(", ")
									),
								},
								{
									label: "Network(s)",
									value: detailValue(
										details.networks.map((network) => network.name).join(", ")
									),
								},
								{
									label: "Writer(s)",
									value: detailValue(crew.writers.join(", ")),
								},
								{ label: "Certification", value: detailValue(certification) },
								{
									label: "Producer(s)",
									value: detailValue(crew.producers.join(", ")),
								},
							]}
						/>
						<WatchProviders providers={providers} />

						<h3 className="mt-8 text-lg font-semibold">Actors</h3>
						<div className="mt-3">
							<CastRow
								items={(details.credits?.cast ?? [])
									.slice(0, 12)
									.map((person) => ({
										character: person.character,
										id: person.id,
										name: person.name,
										profile: getProfileUrl(person.profile_path),
									}))}
							/>
						</div>

						{details.seasons.length > 0 ? (
							<>
								<h3 className="mt-8 text-lg font-semibold">Seasons</h3>
								<div className="mt-3 flex gap-4 overflow-x-auto pb-2">
									{details.seasons.map((season) => (
										<Link
											className="bg-card group w-44 shrink-0 overflow-hidden rounded-2xl border transition-transform duration-300 hover:scale-[1.03]"
											key={season.id}
											params={{
												seasonNumber: String(season.season_number),
												tvId,
											}}
											to="/tv/$tvId/season/$seasonNumber"
										>
											{season.poster_path ? (
												<img
													alt={season.name}
													className="aspect-2/3 w-full object-cover"
													decoding="async"
													loading="lazy"
													src={
														getPosterUrl(season.poster_path, "w342") ??
														undefined
													}
												/>
											) : (
												<div className="bg-muted text-muted-foreground flex aspect-2/3 w-full items-center justify-center text-xs">
													No image
												</div>
											)}
											<div className="p-3">
												<p className="truncate text-sm font-semibold group-hover:underline">
													{season.name}
												</p>
												<p className="text-muted-foreground mt-0.5 text-xs">
													{season.episode_count} episode
													{season.episode_count === 1 ? "" : "s"}
													{season.air_date
														? ` · ${season.air_date.slice(0, 4)}`
														: ""}
												</p>
											</div>
										</Link>
									))}
								</div>
							</>
						) : null}
					</TabsContent>

					<TabsContent className="mt-4" value="reviews">
						<h2 className="text-xl font-semibold">Reviews</h2>
						<ReviewsList reviews={reviews} />
					</TabsContent>

					<TabsContent className="mt-4" value="similar">
						<MediaRow
							items={similar.slice(0, 10).map((show) => ({
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
							title="Similar TV Shows"
						/>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
