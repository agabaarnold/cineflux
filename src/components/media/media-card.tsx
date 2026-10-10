import {
	IconBookmark,
	IconBookmarkFilled,
	IconStarFilled,
	IconTrendingUp,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { AspectRatio } from "#/components/ui/aspect-ratio.tsx";
import { useWatchlistItem } from "#/hooks/use-watchlist.ts";

export type CardStat =
	| { kind: "popularity"; value: number }
	| { kind: "rating"; value: number }
	| null;

export type CardMediaType = "movie" | "person" | "tv";

const mediaTypeLabel = (mediaType: CardMediaType) => {
	if (mediaType === "movie") {
		return "Movie";
	}
	if (mediaType === "tv") {
		return "TV Show";
	}
	return "Person";
};

export const MediaCard = ({
	href,
	image,
	mediaId,
	mediaType,
	overview,
	stat,
	title,
	year,
}: {
	href: string;
	image: string | null;
	mediaId: number;
	mediaType: CardMediaType;
	overview: string;
	stat: CardStat;
	title: string;
	year: string;
}) => {
	const { isPending, saved, toggle } = useWatchlistItem(mediaType, mediaId);
	return (
		<div className="group w-44 shrink-0">
			<div className="bg-card relative overflow-hidden rounded-2xl border transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-lg">
				<Link className="block" to={href}>
					<div className="relative">
						<AspectRatio ratio={2 / 3}>
							{image ? (
								<img
									alt={title}
									className="h-full w-full object-cover"
									decoding="async"
									loading="lazy"
									src={image}
								/>
							) : (
								<div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-xs">
									No image
								</div>
							)}
						</AspectRatio>
						<span className="absolute top-2 left-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold tracking-wide text-black uppercase">
							{mediaTypeLabel(mediaType)}
						</span>
					</div>
					<div className="p-4">
						<p className="text-card-foreground truncate font-bold">{title}</p>
						<p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
							{stat === null ? null : (
								<span className="text-star flex items-center gap-1 font-semibold">
									{stat.value.toFixed(1)}
									{stat.kind === "rating" ? (
										<IconStarFilled className="size-3.5" />
									) : (
										<IconTrendingUp className="size-3.5" />
									)}
								</span>
							)}
							{year ? <span>{year}</span> : null}
						</p>
						{overview ? (
							<p className="text-muted-foreground mt-2 line-clamp-3 text-xs leading-relaxed">
								{overview}
							</p>
						) : null}
					</div>
				</Link>
				<button
					aria-busy={isPending}
					aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
					aria-pressed={saved}
					className={`absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-black/60 text-white${isPending ? " opacity-70" : ""}`}
					onClick={toggle}
					type="button"
				>
					{saved ? (
						<IconBookmarkFilled className="size-4" />
					) : (
						<IconBookmark className="size-4" />
					)}
				</button>
			</div>
		</div>
	);
};
