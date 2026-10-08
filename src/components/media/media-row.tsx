import { IconChevronRight } from "@tabler/icons-react";

import { MediaCard } from "#/components/media/media-card.tsx";
import type {
	CardMediaType,
	CardStat,
} from "#/components/media/media-card.tsx";

export interface RowItem {
	href: string;
	id: string;
	image: string | null;
	mediaId: number;
	mediaType: CardMediaType;
	overview: string;
	stat: CardStat;
	title: string;
	year: string;
}

export const MediaRow = ({
	href,
	items,
	title,
}: {
	href?: string;
	items: RowItem[];
	title: string;
}) => (
	<section>
		{title || href ? (
			<div className="mb-3 flex items-center justify-between">
				{title ? <h2 className="text-2xl font-semibold">{title}</h2> : <span />}
				{href ? (
					<a
						className="text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors"
						href={href}
					>
						View more
						<IconChevronRight className="size-3.5" />
					</a>
				) : null}
			</div>
		) : null}
		<div className="flex gap-4 overflow-x-auto pb-2">
			{items.map((item) => (
				<MediaCard
					href={item.href}
					image={item.image}
					key={item.id}
					mediaId={item.mediaId}
					mediaType={item.mediaType}
					overview={item.overview}
					stat={item.stat}
					title={item.title}
					year={item.year}
				/>
			))}
		</div>
	</section>
);
