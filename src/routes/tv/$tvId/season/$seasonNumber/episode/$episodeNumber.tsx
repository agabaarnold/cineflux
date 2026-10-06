// oxlint-disable react/function-component-definition func-style
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { CastRow } from "#/components/media/cast-row.tsx";
import {
	detailValue,
	formatFullDate,
	InfoRows,
} from "#/components/media/detail-sections.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import {
	fetchTvEpisodeDetailsQueryOptions,
	fetchTvSeriesDetailsQueryOptions,
} from "#/queries/tv.ts";
import { getProfileUrl, getStillUrl } from "#/server/tmdb/images.ts";

const seriesOptions = (id: number) =>
	fetchTvSeriesDetailsQueryOptions({
		data: { id, language: "en-US" },
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
	"/tv/$tvId/season/$seasonNumber/episode/$episodeNumber"
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
		]);
	},
	component: EpisodeDetailsPage,
	errorComponent: RouteError,
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
			</div>

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
