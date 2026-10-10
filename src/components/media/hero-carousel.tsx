// oxlint-disable shadcn/no-raw-colors shadcn/no-restyle
import {
	IconBookmark,
	IconBookmarkFilled,
	IconInfoCircle,
	IconPlayerPauseFilled,
	IconPlayerPlayFilled,
	IconStarFilled,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";

import { useWatchlistItem } from "#/hooks/use-watchlist.ts";

import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import type { CarouselApi } from "../ui/carousel";

export interface HeroSlide {
	id: string;
	href: string;
	backdrop: string | null;
	mediaId: number;
	mediaType: "movie" | "tv";
	title: string;
	overview: string;
	voteAverage: number;
	meta: string;
}

const Stars = ({ voteAverage }: { voteAverage: number }) => {
	const filled = Math.round((voteAverage / 10) * 5);

	return (
		<span
			aria-label={`Rated ${voteAverage.toFixed(1)} out of 10`}
			className="m-0 flex items-center gap-0.5 border-0 p-0"
			// oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
			role="img"
		>
			{Array.from({ length: 5 }, (_, index) => (
				<IconStarFilled
					key={index}
					className={cn(
						"size-3.5",
						index < filled ? "text-amber-400" : "text-white/30"
					)}
				/>
			))}

			<span className="ml-2 text-sm font-semibold text-white">
				{(voteAverage * 10).toFixed(1)}%
			</span>
		</span>
	);
};

const Slide = ({
	priority,
	slide,
}: {
	priority?: boolean;
	slide: HeroSlide;
}) => {
	const { isPending, saved, toggle } = useWatchlistItem(
		slide.mediaType,
		slide.mediaId
	);

	return (
		<div className="relative h-full w-full">
			{slide.backdrop ? (
				<img
					alt=""
					className="absolute inset-0 h-full w-full object-cover"
					decoding="async"
					fetchPriority={priority ? "high" : undefined}
					loading="eager"
					src={slide.backdrop}
				/>
			) : null}

			<div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/40 to-transparent" />
			<div className="from-background absolute inset-0 bg-linear-to-t via-transparent to-transparent" />

			<div className="absolute bottom-0 left-0 max-w-2xl p-8 md:p-12">
				<h2 className="text-4xl font-black tracking-tight text-white uppercase md:text-6xl">
					{slide.title}
				</h2>

				<div className="mt-3 flex items-center gap-3">
					<Stars voteAverage={slide.voteAverage} />
					{slide.meta ? (
						<span className="text-sm text-white/60">{slide.meta}</span>
					) : null}
				</div>

				<p className="mt-3 line-clamp-3 max-w-xl text-white/80">
					{slide.overview}
				</p>

				<div className="mt-5 flex items-center gap-3">
					<Link
						className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-semibold text-black"
						to={slide.href}
					>
						<IconPlayerPlayFilled className="size-4" />
						Play
					</Link>

					<button
						aria-busy={isPending}
						aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
						aria-pressed={saved}
						className={`flex size-11 items-center justify-center rounded-full border border-white/40 text-white${isPending ? " opacity-70" : ""}`}
						onClick={toggle}
						type="button"
					>
						{saved ? (
							<IconBookmarkFilled className="size-5" />
						) : (
							<IconBookmark className="size-5" />
						)}
					</button>

					<Link
						aria-label="More info"
						className="flex size-11 items-center justify-center rounded-full border border-white/40 text-white"
						to={slide.href}
					>
						<IconInfoCircle className="size-5" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export const HeroCarousel = ({ items }: { items: HeroSlide[] }) => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [playing, setPlaying] = useState(true);
	const autoplay = useRef<ReturnType<typeof Autoplay> | null>(null);
	if (autoplay.current === null) {
		// Autoplay is a factory, not a component; calling it here is correct.
		// oxlint-disable-next-line react/capitalized-calls
		autoplay.current = Autoplay({
			delay: 6000,
			stopOnInteraction: false,
			stopOnMouseEnter: true,
		});
	}
	const slides = items.filter((item) => item.backdrop !== null);

	useEffect(() => {
		if (!api) {
			return;
		}
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			api.plugins().autoplay?.stop();
		}

		const plugin = api.plugins().autoplay;
		if (!plugin) {
			return;
		}

		// Syncs local state with the external embla instance on (re)connect.
		// oxlint-disable-next-line react/set-state-in-effect
		setPlaying(plugin.isPlaying());
		const onSelect = () => setCurrent(api.selectedScrollSnap());
		const syncPlaying = () => setPlaying(plugin.isPlaying());
		api.on("select", onSelect);
		api.on("autoplay:play", syncPlaying);
		api.on("autoplay:stop", syncPlaying);
		return () => {
			api.off("select", onSelect);
			api.off("autoplay:play", syncPlaying);
			api.off("autoplay:stop", syncPlaying);
		};
	}, [api]);

	const togglePlaying = () => {
		const plugin = api?.plugins()?.autoplay;
		if (!plugin) {
			return;
		}
		if (plugin.isPlaying()) {
			plugin.stop();
		} else {
			plugin.play();
		}
	};

	if (slides.length === 0) {
		return null;
	}

	return (
		<section
			aria-label="Featured"
			className="relative"
			// Arrow keys supplement the dot buttons below, which keep full keyboard access.
			// oxlint-disable jsx-a11y(no-noninteractive-element-interactions)
			onKeyDown={(event) => {
				if (event.key === "ArrowLeft") {
					api?.scrollPrev();
				} else if (event.key === "ArrowRight") {
					api?.scrollNext();
				}
			}}
		>
			<Carousel
				opts={{ loop: true }}
				// Safe: lazy-initialized write-once above, never reassigned elsewhere.
				// oxlint-disable-next-line react/refs
				plugins={[autoplay.current]}
				setApi={setApi}
			>
				<CarouselContent className="ml-0">
					{slides.map((slide, index) => (
						<CarouselItem className="basis-full pl-0" key={slide.id}>
							<div className="h-[80vh] max-h-180 min-h-120">
								<Slide priority={index === 0} slide={slide} />
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			<div className="absolute top-1/2 right-6 flex -translate-y-1/2 flex-col items-center gap-2">
				{slides.map((slide, index) => (
					<button
						aria-label={`Go to slide ${index + 1}`}
						className={cn(
							"w-0.75 rounded-full transition-all",
							index === current ? "h-12 bg-white" : "h-6 bg-white/30"
						)}
						key={slide.id}
						onClick={() => api?.scrollTo(index)}
						type="button"
					/>
				))}

				<button
					aria-label={playing ? "Pause autoplay" : "Resume autoplay"}
					className="mt-1 flex size-9 items-center justify-center rounded-full bg-black/50 text-white"
					onClick={togglePlaying}
					type="button"
				>
					{playing ? (
						<IconPlayerPauseFilled className="size-4" />
					) : (
						<IconPlayerPlayFilled className="size-4" />
					)}
				</button>
			</div>
		</section>
	);
};
