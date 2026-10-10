// oxlint-disable react/function-component-definition func-style
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";

import { CastRow } from "#/components/media/cast-row.tsx";
import { DetailHero } from "#/components/media/detail-hero.tsx";
import type { DetailHeroMeta } from "#/components/media/detail-hero.tsx";
import {
	detailValue,
	formatCurrency,
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
import { fetchCollectionDetailsQueryOptions } from "#/queries/catalog.ts";
import {
	fetchMovieDetailsQueryOptions,
	fetchMovieReleaseDatesQueryOptions,
	fetchMovieWatchProvidersQueryOptions,
} from "#/queries/movie.ts";
import type {
	MovieDetailsWithAppend,
	MovieReleaseDates,
} from "#/schemas/movie.ts";
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
	fetchMovieDetailsQueryOptions({
		data: {
			append_to_response: [...APPEND_TO_RESPONSE],
			id,
			language: "en-US",
		},
	});

const releaseDatesOptions = (id: number) =>
	fetchMovieReleaseDatesQueryOptions({ data: { id } });

const providersOptions = (id: number) =>
	fetchMovieWatchProvidersQueryOptions({ data: { id } });

const parseId = (value: string) => {
	const id = Number(value);
	if (!Number.isSafeInteger(id) || id <= 0) {
		throw notFound();
	}
	return id;
};

export const Route = createFileRoute("/_app/movie/$movieId")({
	loader: ({ context, params }) => {
		const id = parseId(params.movieId);
		return Promise.all([
			context.queryClient.query({
				...detailOptions(id),
				staleTime: "static",
			}),
			context.queryClient.query({
				...releaseDatesOptions(id),
				staleTime: "static",
			}),
			context.queryClient.query(providersOptions(id)),
		]);
	},
	component: MovieDetailsPage,
	errorComponent: RouteError,
	head: ({ loaderData, params }) => {
		const [details] = loaderData ?? [];
		if (!details) {
			return pageHead({
				description: "Movie details, cast, and reviews on CineFlux.",
				path: `/movie/${params.movieId}`,
				title: pageTitle("Movie"),
			});
		}
		const year = details.release_date.slice(0, 4);
		const name = year ? `${details.title} (${year})` : details.title;
		return pageHead({
			description: truncateDescription(
				details.overview,
				`${name} — details, cast, reviews, and where to watch on CineFlux.`
			),
			image:
				getPosterUrl(details.poster_path, "w780") ??
				getBackdropUrl(details.backdrop_path),
			path: `/movie/${details.id}`,
			title: pageTitle(name),
		});
	},
});

const getUsCertification = (releaseDates: MovieReleaseDates): string =>
	releaseDates.results
		.find((entry) => entry.iso_3166_1 === "US")
		?.release_dates.find((entry) => entry.certification !== "")
		?.certification ?? "";

const getSimilarMovies = (details: MovieDetailsWithAppend) => {
	if ((details.similar?.results.length ?? 0) > 0) {
		return details.similar?.results ?? [];
	}
	return details.recommendations?.results ?? [];
};

const formatRuntime = (minutes: number | null): string => {
	if (minutes === null || minutes <= 0) {
		return "";
	}
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (hours <= 0) {
		return `${rest}m`;
	}
	return `${hours}h ${rest}m`;
};

const getMovieMeta = (details: MovieDetailsWithAppend): DetailHeroMeta[] => {
	const meta: DetailHeroMeta[] = [];
	if (details.release_date) {
		meta.push({
			icon: "date",
			label: "Release date",
			value: formatFullDate(details.release_date),
		});
	}
	if (details.runtime) {
		meta.push({
			icon: "runtime",
			label: "Runtime",
			value: formatRuntime(details.runtime),
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

function MovieDetailsPage() {
	const { movieId } = Route.useParams();
	const id = parseId(movieId);
	const { data: details } = useSuspenseQuery(detailOptions(id));
	const { data: releaseDates } = useSuspenseQuery(releaseDatesOptions(id));
	const { data: providers } = useSuspenseQuery(providersOptions(id));
	const collectionId = details.belongs_to_collection?.id ?? null;
	const { data: collection } = useQuery({
		...fetchCollectionDetailsQueryOptions({
			data: { id: collectionId ?? 0, language: "en-US" },
		}),
		enabled: collectionId !== null,
	});
	const [tab, setTab] = useState("information");

	const crew = getCrewGroups(details.credits?.crew);
	const certification = getUsCertification(releaseDates);
	const trailerKey = getTrailerKey(details.videos);
	const similar = getSimilarMovies(details);
	// SAFETY: spread creates a fresh copy, so in-place sort cannot mutate cached query data.
	const franchise = [...(collection?.parts ?? [])]
		// oxlint-disable-next-line unicorn/no-array-sort
		.sort((a, b) => a.release_date.localeCompare(b.release_date))
		.filter((part) => part.id !== id);
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
				byline={
					crew.directors.length > 0
						? `By ${crew.directors.join(", ")}`
						: undefined
				}
				genres={details.genres}
				meta={getMovieMeta(details)}
				mediaId={id}
				mediaType="movie"
				overview={details.overview}
				poster={getPosterUrl(details.poster_path)}
				sectionHref="/movie"
				sectionLabel="Movies"
				tagline={details.tagline}
				title={details.title}
				trailerUrl={
					trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : null
				}
				voteAverage={details.vote_average}
				voteCount={details.vote_count}
				year={details.release_date.slice(0, 4)}
			/>

			<div className="mx-auto w-full max-w-7xl px-4 py-6">
				<Tabs onValueChange={setTab} value={tab}>
					<TabsList variant="line">
						<TabsTrigger value="information">Information</TabsTrigger>
						<TabsTrigger value="reviews">
							Reviews{reviews.length > 0 ? ` (${reviews.length})` : ""}
						</TabsTrigger>
						<TabsTrigger value="similar">Similar Movies</TabsTrigger>
					</TabsList>

					<TabsContent className="mt-4" value="information">
						<h2 className="text-xl font-semibold">Information</h2>
						<InfoRows
							rows={[
								{
									label: "Director(s)",
									value: detailValue(crew.directors.join(", ")),
								},
								{
									label: "Genre(s)",
									value: detailValue(
										details.genres.map((genre) => genre.name).join(", ")
									),
								},
								{
									label: "Writer(s)",
									value: detailValue(crew.writers.join(", ")),
								},
								{
									label: "Producer(s)",
									value: detailValue(crew.producers.join(", ")),
								},
								{ label: "Certification", value: detailValue(certification) },
								{
									label: "Budget",
									value: detailValue(formatCurrency(details.budget)),
								},
								{
									label: "Revenue",
									value: detailValue(formatCurrency(details.revenue)),
								},
							]}
						/>
						<WatchProviders providers={providers} />
						{franchise.length > 0 ? (
							<div className="mt-8">
								<MediaRow
									items={franchise.map((movie) => ({
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
									title={`More from ${collection?.name ?? "this collection"}`}
								/>
							</div>
						) : null}

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
					</TabsContent>

					<TabsContent className="mt-4" value="reviews">
						<h2 className="text-xl font-semibold">Reviews</h2>
						<ReviewsList reviews={reviews} />
					</TabsContent>

					<TabsContent className="mt-4" value="similar">
						<MediaRow
							items={similar.slice(0, 10).map((movie) => ({
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
							title="Similar Movies"
						/>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
