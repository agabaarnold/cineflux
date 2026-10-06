// oxlint-disable react/function-component-definition func-style
import { IconStarFilled } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";

import { CastRow } from "#/components/media/cast-row.tsx";
import { DetailHero } from "#/components/media/detail-hero.tsx";
import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "#/components/ui/tabs.tsx";
import {
	fetchMovieDetailsQueryOptions,
	fetchMovieReleaseDatesQueryOptions,
} from "#/queries/movie.ts";
import { getBackdropUrl, getPosterUrl } from "#/server/tmdb/images.ts";

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

const parseId = (value: string) => {
	const id = Number(value);
	if (!Number.isSafeInteger(id) || id <= 0) {
		throw notFound();
	}
	return id;
};

export const Route = createFileRoute("/movie/$movieId")({
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
		]);
	},
	component: MovieDetailsPage,
	errorComponent: RouteError,
});

const formatDate = (value: string) => {
	if (!value) {
		return "";
	}
	const date = new Date(`${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return date.toLocaleDateString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

const formatRuntime = (minutes: number | null) => {
	if (minutes === null || minutes <= 0) {
		return "";
	}
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	return hours > 0 ? `${hours}h ${rest}m` : `${rest}m`;
};

const orDash = (value: string) =>
	value ? value : <span className="text-muted-foreground">Not available</span>;

function MovieDetailsPage() {
	const { movieId } = Route.useParams();
	const id = parseId(movieId);
	const { data: details } = useSuspenseQuery(detailOptions(id));
	const { data: releaseDates } = useSuspenseQuery(releaseDatesOptions(id));
	const [tab, setTab] = useState("information");

	const crew = details.credits?.crew ?? [];
	const directors = crew
		.filter((person) => person.job === "Director")
		.slice(0, 3)
		.map((person) => person.name);
	const writers = crew
		.filter((person) => person.department === "Writing")
		.slice(0, 5)
		.map((person) => person.name);
	const producers = crew
		.filter((person) => person.job === "Producer")
		.slice(0, 5)
		.map((person) => person.name);

	const certification =
		releaseDates.results
			.find((entry) => entry.iso_3166_1 === "US")
			?.release_dates.find((entry) => entry.certification !== "")
			?.certification ?? "";

	const trailer =
		details.videos?.results.find(
			(video) => video.site === "YouTube" && video.type === "Trailer"
		) ??
		details.videos?.results.find((video) => video.site === "YouTube") ??
		null;

	const similarResults =
		(details.similar?.results.length ?? 0) > 0
			? (details.similar?.results ?? [])
			: (details.recommendations?.results ?? []);

	const reviews = details.reviews?.results.slice(0, 5) ?? [];

	const meta = [
		details.release_date
			? {
					icon: "date" as const,
					label: "Release date",
					value: formatDate(details.release_date),
				}
			: null,
		details.runtime
			? {
					icon: "runtime" as const,
					label: "Runtime",
					value: formatRuntime(details.runtime),
				}
			: null,
		details.original_language
			? {
					icon: "language" as const,
					label: "Original language",
					value: details.original_language.toUpperCase(),
				}
			: null,
		details.origin_country[0]
			? {
					icon: "country" as const,
					label: "Origin country",
					value: details.origin_country.join(", "),
				}
			: null,
	].filter((item) => item !== null);

	return (
		<div className="flex flex-col">
			<DetailHero
				backdrop={getBackdropUrl(details.backdrop_path, "w1280")}
				byline={directors.length > 0 ? `By ${directors.join(", ")}` : undefined}
				genres={details.genres}
				meta={meta}
				overview={details.overview}
				poster={getPosterUrl(details.poster_path)}
				sectionHref="/movie"
				sectionLabel="Movies"
				tagline={details.tagline}
				title={details.title}
				trailerUrl={
					trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
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

					<TabsContent className="pt-4" value="information">
						<h2 className="text-xl font-semibold">Information</h2>
						<dl className="mt-4 grid gap-x-12 gap-y-3 md:grid-cols-2">
							<div className="flex gap-4">
								<dt className="text-muted-foreground w-32 shrink-0 text-sm">
									Director(s)
								</dt>
								<dd className="text-sm">{orDash(directors.join(", "))}</dd>
							</div>
							<div className="flex gap-4">
								<dt className="text-muted-foreground w-32 shrink-0 text-sm">
									Genre(s)
								</dt>
								<dd className="text-sm">
									{orDash(details.genres.map((genre) => genre.name).join(", "))}
								</dd>
							</div>
							<div className="flex gap-4">
								<dt className="text-muted-foreground w-32 shrink-0 text-sm">
									Writer(s)
								</dt>
								<dd className="text-sm">{orDash(writers.join(", "))}</dd>
							</div>
							<div className="flex gap-4">
								<dt className="text-muted-foreground w-32 shrink-0 text-sm">
									Producer(s)
								</dt>
								<dd className="text-sm">{orDash(producers.join(", "))}</dd>
							</div>
							<div className="flex gap-4">
								<dt className="text-muted-foreground w-32 shrink-0 text-sm">
									Certification
								</dt>
								<dd className="text-sm">{orDash(certification)}</dd>
							</div>
						</dl>

						<h3 className="mt-8 text-lg font-semibold">Actors</h3>
						<div className="mt-3">
							<CastRow
								items={(details.credits?.cast ?? [])
									.slice(0, 12)
									.map((person) => ({
										character: person.character,
										id: person.id,
										name: person.name,
										profile: person.profile_path,
									}))}
							/>
						</div>
					</TabsContent>

					<TabsContent className="pt-4" value="reviews">
						<h2 className="text-xl font-semibold">Reviews</h2>
						{reviews.length === 0 ? (
							<p className="text-muted-foreground mt-4 text-sm">
								No reviews available for this title yet.
							</p>
						) : (
							<ul className="mt-4 space-y-4">
								{reviews.map((review) => (
									<li
										className="bg-card rounded-2xl border p-4"
										key={review.id}
									>
										<div className="flex items-center gap-2">
											<p className="font-semibold">
												{review.author_details.username || review.author}
											</p>
											{review.author_details.rating === null ? null : (
												<span className="flex items-center gap-1 text-sm font-semibold">
													<IconStarFilled
														aria-hidden="true"
														className="size-3.5 text-amber-400"
													/>
													{review.author_details.rating.toFixed(1)}
												</span>
											)}
											<span className="text-muted-foreground ml-auto text-xs">
												{review.created_at.slice(0, 10)}
											</span>
										</div>
										<p className="text-muted-foreground mt-2 line-clamp-6 text-sm leading-relaxed">
											{review.content}
										</p>
										<a
											className="text-primary mt-2 inline-block text-sm font-medium hover:underline"
											href={review.url}
											rel="noopener noreferrer"
											target="_blank"
										>
											Read full review
										</a>
									</li>
								))}
							</ul>
						)}
					</TabsContent>

					<TabsContent className="pt-4" value="similar">
						<MediaRow
							items={similarResults.slice(0, 10).map((movie) => ({
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
							title="Similar Movies"
						/>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
