// oxlint-disable react/function-component-definition func-style
import { IconCake, IconMapPin } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { MediaRow } from "#/components/media/media-row.tsx";
import { RouteError } from "#/components/shared/route-error.tsx";
import { AspectRatio } from "#/components/ui/aspect-ratio.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { fetchPersonDetailsQueryOptions } from "#/queries/person.ts";
import { getPosterUrl, getProfileUrl } from "#/server/tmdb/images.ts";

const detailOptions = (id: number) =>
	fetchPersonDetailsQueryOptions({
		data: {
			append_to_response: ["combined_credits"],
			id,
			language: "en-US",
		},
	});

const parseId = (value: string) => {
	const id = Number(value);
	if (!Number.isSafeInteger(id) || id <= 0) {
		throw notFound();
	}
	return id;
};

export const Route = createFileRoute("/person/$personId")({
	loader: ({ context, params }) => {
		const id = parseId(params.personId);
		return context.queryClient.query({
			...detailOptions(id),
			staleTime: "static",
		});
	},
	component: PersonDetailsPage,
	errorComponent: RouteError,
});

const formatDate = (value: string | null | undefined) => {
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

function PersonDetailsPage() {
	const { personId } = Route.useParams();
	const id = parseId(personId);
	const { data: details } = useSuspenseQuery(detailOptions(id));

	// SAFETY: spread creates a fresh copy, so in-place sort cannot mutate cached query data.
	// oxlint-disable-next-line unicorn/no-array-sort
	const knownFor = [...(details.combined_credits?.cast ?? [])]
		.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
		.slice(0, 10);

	const birthday = formatDate(details.birthday);
	const deathday = formatDate(details.deathday);

	return (
		<div className="mx-auto w-full max-w-7xl px-4 pt-24 pb-6">
			<nav
				aria-label="Breadcrumb"
				className="text-muted-foreground flex items-center gap-1.5 text-sm"
			>
				<Link className="hover:text-foreground transition-colors" to="/">
					Home
				</Link>
				<span aria-hidden="true">›</span>
				<Link className="hover:text-foreground transition-colors" to="/people">
					People
				</Link>
				<span aria-hidden="true">›</span>
				<span aria-current="page" className="text-foreground max-w-48 truncate">
					{details.name}
				</span>
			</nav>

			<div className="mt-6 flex flex-col gap-6 md:flex-row md:gap-8">
				<div className="w-40 shrink-0 md:w-56">
					<div className="overflow-hidden rounded-2xl border shadow-xl">
						<AspectRatio ratio={2 / 3}>
							{details.profile_path ? (
								<img
									alt={details.name}
									className="h-full w-full object-cover"
									src={getProfileUrl(details.profile_path, "h632") ?? undefined}
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
					<Badge variant="secondary">{details.known_for_department}</Badge>
					<h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
						{details.name}
					</h1>

					<div className="text-muted-foreground mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
						{birthday ? (
							<span className="flex items-center gap-1.5">
								<IconCake aria-hidden="true" className="size-4" />
								Born {birthday}
							</span>
						) : null}
						{details.place_of_birth ? (
							<span className="flex items-center gap-1.5">
								<IconMapPin aria-hidden="true" className="size-4" />
								{details.place_of_birth}
							</span>
						) : null}
						{deathday ? (
							<span className="flex items-center gap-1.5">Died {deathday}</span>
						) : null}
					</div>

					<h2 className="mt-6 text-xl font-semibold">Biography</h2>
					{details.biography ? (
						<p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed whitespace-pre-wrap">
							{details.biography}
						</p>
					) : (
						<p className="text-muted-foreground mt-2 text-sm">
							No biography available.
						</p>
					)}
				</div>
			</div>

			<div className="mt-10">
				<MediaRow
					items={knownFor.map((credit) => {
						const isMovie = credit.media_type === "movie";
						const title = isMovie
							? (credit.title ?? "Untitled")
							: (credit.name ?? "Untitled");
						const date = isMovie
							? (credit.release_date ?? "")
							: (credit.first_air_date ?? "");
						return {
							href: isMovie ? `/movie/${credit.id}` : `/tv/${credit.id}`,
							id: credit.credit_id,
							image: getPosterUrl(credit.poster_path),
							mediaType: credit.media_type,
							overview: credit.overview ?? "",
							stat:
								credit.vote_average === undefined
									? null
									: ({
											kind: "rating",
											value: credit.vote_average,
										} as const),
							title,
							year: (date ?? "").slice(0, 4),
						};
					})}
					title="Known for"
				/>
			</div>
		</div>
	);
}
