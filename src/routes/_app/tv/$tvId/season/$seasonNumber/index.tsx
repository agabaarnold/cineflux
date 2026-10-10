// oxlint-disable react/function-component-definition func-style
import { IconStarFilled } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { CastRow } from "#/components/media/cast-row.tsx";
import { formatFullDate } from "#/components/media/detail-sections.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { AspectRatio } from "#/components/ui/aspect-ratio.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { pageHead, pageTitle, truncateDescription } from "#/lib/seo.ts";
import {
	fetchTvSeasonCreditsQueryOptions,
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

const creditsOptions = (id: number, seasonNumber: number) =>
	fetchTvSeasonCreditsQueryOptions({
		data: { id, language: "en-US", season_number: seasonNumber },
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

export const Route = createFileRoute("/_app/tv/$tvId/season/$seasonNumber/")({
	loader: ({ context, params }) => {
		const id = parseId(params.tvId);
		const seasonNumber = parseSeasonNumber(params.seasonNumber);
		return Promise.all([
			context.queryClient.query({
				...seriesOptions(id),
				staleTime: "static",
			}),
			context.queryClient.query({
				...seasonOptions(id, seasonNumber),
				staleTime: "static",
			}),
			context.queryClient.query({
				...creditsOptions(id, seasonNumber),
				staleTime: "static",
			}),
		]);
	},
	component: SeasonDetailsPage,
	errorComponent: RouteError,
	head: ({ loaderData }) => {
		const [series, season] = loaderData ?? [];
		if (!series || !season) {
			return pageHead({
				description: "TV season details and episodes on CineFlux.",
				title: pageTitle("Season"),
			});
		}
		const name = `${series.name} Season ${season.season_number}`;
		return pageHead({
			description: truncateDescription(
				season.overview,
				`${name} — episodes and cast on CineFlux.`
			),
			image:
				getPosterUrl(season.poster_path, "w780") ??
				getPosterUrl(series.poster_path, "w780"),
			title: pageTitle(name),
		});
	},
});

function SeasonDetailsPage() {
	const { seasonNumber: seasonParam, tvId } = Route.useParams();
	const id = parseId(tvId);
	const seasonNumber = parseSeasonNumber(seasonParam);
	const { data: series } = useSuspenseQuery(seriesOptions(id));
	const { data: season } = useSuspenseQuery(seasonOptions(id, seasonNumber));
	const { data: credits } = useSuspenseQuery(creditsOptions(id, seasonNumber));

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
					className="hover:text-foreground max-w-48 truncate transition-colors"
					params={{ tvId }}
					to="/tv/$tvId"
				>
					{series.name}
				</Link>
				<span aria-hidden="true">›</span>
				<span aria-current="page" className="text-foreground">
					{season.name}
				</span>
			</nav>

			<div className="mt-6 flex flex-col gap-6 md:flex-row md:gap-8">
				<div className="w-40 shrink-0 md:w-56">
					<div className="overflow-hidden rounded-2xl border shadow-xl">
						<AspectRatio ratio={2 / 3}>
							{season.poster_path ? (
								<img
									alt={season.name}
									className="h-full w-full object-cover"
									src={getPosterUrl(season.poster_path) ?? undefined}
								/>
							) : (
								<div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-xs">
									No image
								</div>
							)}
						</AspectRatio>
					</div>
				</div>

				<div className="min-w-0 flex-1">
					<Badge variant="secondary">
						Season {season.season_number} · {season.episodes.length} episode
						{season.episodes.length === 1 ? "" : "s"}
					</Badge>
					<h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
						{season.name}
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
					{season.overview ? (
						<p className="text-muted-foreground mt-3 max-w-3xl leading-relaxed">
							{season.overview}
						</p>
					) : null}
					{season.air_date ? (
						<p className="text-muted-foreground mt-3 text-sm">
							Aired {formatFullDate(season.air_date)}
						</p>
					) : null}
				</div>
			</div>

			{(credits?.cast.length ?? 0) > 0 ? (
				<>
					<h2 className="mt-10 text-xl font-semibold">Cast</h2>
					<div className="mt-3">
						<CastRow
							items={(credits?.cast ?? []).slice(0, 12).map((person) => ({
								character: person.character,
								id: person.id,
								name: person.name,
								profile: getProfileUrl(person.profile_path),
							}))}
						/>
					</div>
				</>
			) : null}

			<h2 className="mt-10 text-xl font-semibold">Episodes</h2>
			{season.episodes.length === 0 ? (
				<p className="text-muted-foreground mt-4 text-sm">
					No episodes listed for this season yet.
				</p>
			) : (
				<ul className="mt-4 space-y-3">
					{season.episodes.map((episode) => (
						<li key={episode.id}>
							<Link
								className="bg-card group flex gap-4 rounded-2xl border p-3 transition-transform duration-300 hover:scale-[1.01]"
								params={{
									episodeNumber: String(episode.episode_number),
									seasonNumber: String(season.season_number),
									tvId,
								}}
								to="/tv/$tvId/season/$seasonNumber/episode/$episodeNumber"
							>
								<div className="w-32 shrink-0 overflow-hidden rounded-xl sm:w-44">
									{episode.still_path ? (
										<img
											alt=""
											className="aspect-video w-full object-cover"
											loading="lazy"
											src={getStillUrl(episode.still_path) ?? undefined}
										/>
									) : (
										<div className="bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center text-xs">
											No image
										</div>
									)}
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate font-semibold group-hover:underline">
										E{episode.episode_number} · {episode.name}
									</p>
									<p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
										{episode.air_date ? (
											<span>{formatFullDate(episode.air_date)}</span>
										) : null}
										{episode.runtime ? <span>{episode.runtime}m</span> : null}
										<span className="text-foreground flex items-center gap-1 font-semibold">
											<IconStarFilled
												aria-hidden="true"
												className="text-star size-3.5"
											/>
											{episode.vote_average.toFixed(1)}
										</span>
									</p>
									{episode.overview ? (
										<p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
											{episode.overview}
										</p>
									) : null}
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
