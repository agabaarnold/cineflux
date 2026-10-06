import {
	IconBookmark,
	IconBookmarkFilled,
	IconCalendar,
	IconChevronRight,
	IconClock,
	IconInfoCircle,
	IconMapPin,
	IconPlayerPlayFilled,
	IconStarFilled,
	IconWorld,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { AspectRatio } from "#/components/ui/aspect-ratio.tsx";
import { Badge } from "#/components/ui/badge.tsx";

export interface DetailHeroMeta {
	icon: string;
	label: string;
	value: string;
}

export interface DetailHeroGenre {
	id: number;
	name: string;
}

export interface DetailHeroProps {
	backdrop: string | null;
	byline?: string;
	genres: DetailHeroGenre[];
	meta: DetailHeroMeta[];
	overview: string;
	poster: string | null;
	sectionHref: string;
	sectionLabel: string;
	tagline?: string | null;
	title: string;
	trailerUrl: string | null;
	voteAverage: number;
	voteCount: number;
	year: string;
}

const metaIcons: Record<string, Icon> = {
	country: IconMapPin,
	date: IconCalendar,
	info: IconInfoCircle,
	language: IconWorld,
	runtime: IconClock,
};

export const DetailHero = ({
	backdrop,
	byline,
	genres,
	meta,
	overview,
	poster,
	sectionHref,
	sectionLabel,
	tagline,
	title,
	trailerUrl,
	voteAverage,
	voteCount,
	year,
}: DetailHeroProps) => {
	const [saved, setSaved] = useState(false);

	return (
		<section className="relative overflow-hidden">
			{backdrop ? (
				<img
					alt=""
					className="absolute inset-0 h-full w-full object-cover"
					src={backdrop}
				/>
			) : (
				<div className="bg-muted absolute inset-0" />
			)}
			<div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/40 to-transparent" />
			<div className="from-background absolute inset-0 bg-linear-to-t via-transparent to-transparent" />

			<div className="relative mx-auto w-full max-w-7xl px-4 pt-24 pb-8 md:pb-12">
				<nav
					aria-label="Breadcrumb"
					className="flex items-center gap-1.5 text-sm text-white/60"
				>
					<Link className="transition-colors hover:text-white" to="/">
						Home
					</Link>
					<IconChevronRight aria-hidden="true" className="size-3.5" />
					<Link className="transition-colors hover:text-white" to={sectionHref}>
						{sectionLabel}
					</Link>
					<IconChevronRight aria-hidden="true" className="size-3.5" />
					<span aria-current="page" className="max-w-48 truncate text-white">
						{title}
					</span>
				</nav>

				<div className="mt-6 flex flex-col gap-6 md:flex-row md:gap-8">
					<div className="w-40 shrink-0 md:w-56">
						<div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
							<AspectRatio ratio={2 / 3}>
								{poster ? (
									<img
										alt={title}
										className="h-full w-full object-cover"
										src={poster}
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
						{genres.length > 0 ? (
							<div className="flex flex-wrap gap-1.5">
								{genres.map((genre) => (
									<Badge key={genre.id} variant="secondary">
										{genre.name}
									</Badge>
								))}
							</div>
						) : null}

						<h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl">
							{title}{" "}
							{year ? <span className="text-white/50">{year}</span> : null}
						</h1>

						{tagline ? (
							<p className="mt-1 text-sm text-white/50 italic">
								&ldquo;{tagline}&rdquo;
							</p>
						) : null}

						{byline ? (
							<p className="mt-1 text-sm text-white/60">{byline}</p>
						) : null}

						<p className="mt-3 max-w-2xl leading-relaxed text-white/80">
							{overview}
						</p>

						{meta.length > 0 ? (
							<dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
								{meta.map((item) => {
									const MetaIcon = metaIcons[item.icon] ?? IconInfoCircle;
									return (
										<div className="flex items-center gap-1.5" key={item.label}>
											<MetaIcon
												aria-hidden="true"
												className="size-4 text-white/40"
											/>
											<dt className="sr-only">{item.label}</dt>
											<dd className="text-white/80">{item.value}</dd>
										</div>
									);
								})}
							</dl>
						) : null}

						<div className="mt-5 flex flex-wrap items-center gap-3">
							{trailerUrl ? (
								<a
									className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-semibold text-black transition-colors hover:bg-white/85"
									href={trailerUrl}
									rel="noopener noreferrer"
									target="_blank"
								>
									<IconPlayerPlayFilled className="size-4" />
									Watch Trailer
								</a>
							) : null}

							<button
								aria-label={
									saved ? "Remove from watchlist" : "Add to watchlist"
								}
								aria-pressed={saved}
								className="flex size-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10"
								onClick={() => setSaved((previous) => !previous)}
								type="button"
							>
								{saved ? (
									<IconBookmarkFilled className="size-5" />
								) : (
									<IconBookmark className="size-5" />
								)}
							</button>

							<span className="ml-1 flex items-center gap-1.5 text-sm text-white">
								<IconStarFilled
									aria-hidden="true"
									className="size-4 text-star"
								/>
								<span className="font-semibold">{voteAverage.toFixed(1)}</span>
								<span className="text-white/50">
									/ 10 · {voteCount.toLocaleString()} votes
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
