// oxlint-disable react/function-component-definition func-style
import { IconChevronLeft, IconChevronRight, IconPlayerPlayFilled } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { CastRow } from "#/components/media/cast-row.tsx";
import {
	detailValue,
	formatFullDate,
	getTrailerKey,
	InfoRows,
} from "#/components/media/detail-sections.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { pageHead, pageTitle, truncateDescription } from "#/lib/seo.ts";
import {
	fetchTvEpisodeDetailsQueryOptions,
	fetchTvEpisodeVideosQueryOptions,
	fetchTvSeasonDetailsQueryOptions,
	fetchTvSeriesDetailsQueryOptions,
} from "#/queries/tv.ts";
import {
	getPosterUrl,
	getProfileUrl,
	getStillUrl,
} from "#/server/tmdb/images.ts";

const seriesOptions = (id: number) =>
	fetchTvSeriesDetailsQueryOptions({
		data: { id, language: "en-US" },
	});

const seasonOptions = (id: number, seasonNumber: number) =>
	fetchTvSeasonDetailsQueryOptions({
		data: { id, language: "en-US", season_number: seasonNumber },
	});

const episodeOptions = (
	id: number,
	seasonNumber: number,
	episodeNumber: number
) =>
	fetchTvEpisodeDetailsQueryOptions({
		data: {
			episode_number: episodeNumber,
			id,
			language: "en-US",
			season_number: seasonNumber,
		},
	});

const videosOptions = (
	id: number,
	seasonNumber: number,
	episodeNumber: number
) =>
	fetchTvEpisodeVideosQueryOptions({
		data: {
			episode_number: episodeNumber,
			id,
			language: "en-US",
			season_number: seasonNumber,
		},
	});

const parseId = (value: string) => {
	const id = Number(value);
	if (!Number.isSafeInteger(id) || id <= 0) {
		throw notFound();
	}
	return id;
};

const parseSeasonNumber = (value: string) => {
	const seasonNumber = Number(value);
	if (!Number.isSafeInteger(seasonNumber) || seasonNumber < 0) {
		throw notFound();
	}
	return seasonNumber;
};

const parseEpisodeNumber = (value: string) => {
	const episodeNumber = Number(value);
	if (!Number.isSafeInteger(episodeNumber) || episodeNumber < 0) {
		throw notFound();
	}
	return episodeNumber;
};

export const Route = createFileRoute(
	"/_app/tv/$tvId/season/$seasonNumber/episode/$episodeNumber"
)({
	loader: ({ context, params }) => {
		const id = parseId(params.tvId);
		const seasonNumber = parseSeasonNumber(params.seasonNumber);
		const episodeNumber = parseEpisodeNumber(params.episodeNumber);
		return Promise.all([
			context.queryClient.query({
				...seriesOptions(id),
				staleTime: "static",
			}),
			context.queryClient.query({
				...episodeOptions(id, seasonNumber, episodeNumber),
				staleTime: "static",
			}),
			context.queryClient.query({
				...videosOptions(id, seasonNumber, episodeNumber),
				staleTime: "static",
			}),
			context.queryClient.query({
				...seasonOptions(id, seasonNumber),
				staleTime: "static",
			}),
		]);
	},
	component: EpisodeDetailsPage,
	errorComponent: RouteError,
	head: ({ loaderData, params }) => {
		const [series, episode] = loaderData ?? [];
		if (!series || !episode) {
			return pageHead({
				description: "TV episode details and cast on CineFlux.",
				path: `/tv/${params.tvId}/season/${params.seasonNumber}/episode/${params.episodeNumber}`,
				title: pageTitle("Episode"),
			});
		}
		const name = `${series.name} S${params.seasonNumber} E${params.episodeNumber}: ${episode.name}`;
		return pageHead({
			description: truncateDescription(
				episode.overview,
				`${name} — details and cast on CineFlux.`
			),
			image:
				getStillUrl(episode.still_path, "original") ??
				getPosterUrl(series.poster_path, "w780"),
			path: `/tv/${series.id}/season/${episode.season_number}/episode/${episode.episode_number}`,
			title: pageTitle(name),
		});
	},
});

function EpisodeDetailsPage() {
	const {
		episodeNumber: episodeParam,
		seasonNumber: seasonParam,
		tvId,
	} = Route.useParams();
	const id = parseId(tvId);
	const seasonNumber = parseSeasonNumber(seasonParam);
	const episodeNumber = parseEpisodeNumber(episodeParam);
	const { data: series } = useSuspenseQuery(seriesOptions(id));
	const { data: episode } = useSuspenseQuery(
		episodeOptions(id, seasonNumber, episodeNumber)
	);
	const { data: videos } = useSuspenseQuery(
		videosOptions(id, seasonNumber, episodeNumber)
	);
	const { data: season } = useSuspenseQuery(seasonOptions(id, seasonNumber));
	const previousEpisode =
		season.episodes.find(
			(item) => item.episode_number === episode.episode_number - 1
		) ?? null;
	const nextEpisode =
		season.episodes.find(
			(item) => item.episode_number === episode.episode_number + 1
		) ?? null;
	const trailerKey = getTrailerKey(videos);

	const crew = episode.crew ?? [];
	const directors: string[] = [];
	const writers: string[] = [];
	for (const person of crew) {
		if (person.job === "Director") {
			directors.push(person.name ?? "Unknown");
		}
		if (person.department === "Writing") {
			writers.push(person.name ?? "Unknown");
		}
	}

	return (
		<div className="mx-auto w-full max-w-7xl px-4 pt-24 pb-6">
			<nav
				aria-label="Breadcrumb"
				className="text-muted-foreground flex items-center gap-1.5 text-sm"
			>
				<Link className="hover:text-foreground transition-colors" to="/tv">
					TV Shows
				</Link>
				<span aria-hidden="true">›</span>
				<Link
					className="hover:text-foreground max-w-40 truncate transition-colors"
					params={{ tvId }}
					to="/tv/$tvId"
				>
					{series.name}
				</Link>
				<span aria-hidden="true">›</span>
				<Link
					className="hover:text-foreground transition-colors"
					params={{ seasonNumber: String(seasonNumber), tvId }}
					to="/tv/$tvId/season/$seasonNumber"
				>
					Season {seasonNumber}
				</Link>
				<span aria-hidden="true">›</span>
				<span aria-current="page" className="text-foreground">
					Episode {episodeNumber}
				</span>
			</nav>

			{episode.still_path ? (
				<div className="mt-6 overflow-hidden rounded-2xl border">
					<img
						alt=""
						className="aspect-video w-full object-cover"
						decoding="async"
						src={getStillUrl(episode.still_path, "original") ?? undefined}
					/>
				</div>
			) : null}

			<div className="mt-6 max-w-3xl">
				<Badge variant="secondary">
					S{seasonNumber} · E{episode.episode_number}
				</Badge>
				<h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
					{episode.name}
				</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					From{" "}
					<Link
						className="text-primary font-medium hover:underline"
						params={{ tvId }}
						to="/tv/$tvId"
					>
						{series.name}
					</Link>
				</p>
				{episode.overview ? (
					<p className="text-muted-foreground mt-3 leading-relaxed">
						{episode.overview}
					</p>
				) : null}
				{trailerKey ? (
					<div className="mt-4">
						<a
							className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
							href={`https://www.youtube.com/watch?v=${trailerKey}`}
							rel="noopener noreferrer"
							target="_blank"
						>
							<IconPlayerPlayFilled aria-hidden="true" className="size-4" />
							Watch Trailer
						</a>
					</div>
				) : null}
			</div>

			<nav
				aria-label="Episodes"
				className="mt-6 flex items-center justify-between gap-2"
			>
				{previousEpisode ? (
					<Link
						aria-label={`Previous episode: ${previousEpisode.name}`}
						className="hover:bg-accent hover:text-accent-foreground flex h-9 items-center gap-1 rounded-full border px-4 text-sm font-medium transition-colors"
						params={{
							episodeNumber: String(previousEpisode.episode_number),
							seasonNumber: String(season.season_number),
							tvId: String(series.id),
						}}
						to="/tv/$tvId/season/$seasonNumber/episode/$episodeNumber"
					>
						<IconChevronLeft aria-hidden="true" className="size-4" />
						E{previousEpisode.episode_number}
					</Link>
				) : (
					<span />
				)}
				{nextEpisode ? (
					<Link
						aria-label={`Next episode: ${nextEpisode.name}`}
						className="hover:bg-accent hover:text-accent-foreground flex h-9 items-center gap-1 rounded-full border px-4 text-sm font-medium transition-colors"
						params={{
							episodeNumber: String(nextEpisode.episode_number),
							seasonNumber: String(season.season_number),
							tvId: String(series.id),
						}}
						to="/tv/$tvId/season/$seasonNumber/episode/$episodeNumber"
					>
						E{nextEpisode.episode_number}
						<IconChevronRight aria-hidden="true" className="size-4" />
					</Link>
				) : (
					<span />
				)}
			</nav>

			<div className="mt-6 max-w-3xl">
				<h2 className="text-xl font-semibold">Information</h2>
				<InfoRows
					rows={[
						{
							label: "Air date",
							value: detailValue(formatFullDate(episode.air_date)),
						},
						{
							label: "Runtime",
							value: detailValue(episode.runtime ? `${episode.runtime}m` : ""),
						},
						{
							label: "Rating",
							value: detailValue(
								episode.vote_count > 0
									? `${episode.vote_average.toFixed(1)} / 10 (${episode.vote_count} votes)`
									: ""
							),
						},
						{ label: "Director(s)", value: detailValue(directors.join(", ")) },
						{ label: "Writer(s)", value: detailValue(writers.join(", ")) },
					]}
				/>

				<h3 className="mt-8 text-lg font-semibold">Guest stars</h3>
				<div className="mt-3">
					<CastRow
						items={episode.guest_stars.map((person) => ({
							character: person.character ?? "",
							id: person.id,
							name: person.name ?? "Unknown",
							profile: getProfileUrl(person.profile_path),
						}))}
					/>
				</div>
			</div>
		</div>
	);
}
