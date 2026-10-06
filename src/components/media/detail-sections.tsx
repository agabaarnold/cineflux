// Shared, non-component helpers live alongside the detail sections below;
// the file intentionally mixes helpers and components.
// oxlint-disable react-doctor/only-export-components
import { IconStarFilled } from "@tabler/icons-react";
import type { ReactNode } from "react";

export const formatFullDate = (value: string | null | undefined): string => {
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

export const detailValue = (value: string): ReactNode =>
	value || <span className="text-muted-foreground">Not available</span>;

interface CrewEntry {
	department: string;
	job: string;
	name: string;
}

export interface CrewGroups {
	directors: string[];
	producers: string[];
	writers: string[];
}

export const getCrewGroups = (crew: CrewEntry[] | undefined): CrewGroups => {
	const list = crew ?? [];
	return {
		directors: list
			.filter((person) => person.job === "Director")
			.slice(0, 3)
			.map((person) => person.name),
		producers: list
			.filter((person) => person.job === "Producer")
			.slice(0, 5)
			.map((person) => person.name),
		writers: list
			.filter((person) => person.department === "Writing")
			.slice(0, 5)
			.map((person) => person.name),
	};
};

interface TrailerVideo {
	key: string;
	site: string;
	type: string;
}

export const getTrailerKey = (
	videos: { results: TrailerVideo[] } | undefined
): string | null => {
	const results = videos?.results ?? [];
	const trailer = results.find(
		(video) => video.site === "YouTube" && video.type === "Trailer"
	);
	if (trailer) {
		return trailer.key;
	}
	const anyVideo = results.find((video) => video.site === "YouTube");
	if (anyVideo) {
		return anyVideo.key;
	}
	return null;
};

export const InfoRows = ({
	rows,
}: {
	rows: { label: string; value: ReactNode }[];
}) => (
	<dl className="mt-4 grid gap-x-12 gap-y-3 md:grid-cols-2">
		{rows.map((row) => (
			<div className="flex gap-4" key={row.label}>
				<dt className="text-muted-foreground w-32 shrink-0 text-sm">
					{row.label}
				</dt>
				<dd className="text-sm">{row.value}</dd>
			</div>
		))}
	</dl>
);

export interface ReviewItem {
	author: string;
	content: string;
	date: string;
	id: string;
	rating: number | null;
	url: string;
}

export const ReviewsList = ({ reviews }: { reviews: ReviewItem[] }) => {
	if (reviews.length === 0) {
		return (
			<p className="text-muted-foreground mt-4 text-sm">
				No reviews available for this title yet.
			</p>
		);
	}

	return (
		<ul className="mt-4 space-y-4">
			{reviews.map((review) => (
				<li className="bg-card rounded-2xl border p-4" key={review.id}>
					<div className="flex items-center gap-2">
						<p className="font-semibold">{review.author}</p>
						{review.rating === null ? null : (
							<span className="flex items-center gap-1 text-sm font-semibold">
								<IconStarFilled
									aria-hidden="true"
									className="size-3.5 text-star"
								/>
								{review.rating.toFixed(1)}
							</span>
						)}
						<span className="text-muted-foreground ml-auto text-xs">
							{review.date}
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
	);
};
