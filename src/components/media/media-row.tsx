import { MediaCard } from "#/components/media/media-card.tsx";
import type {
	CardMediaType,
	CardStat,
} from "#/components/media/media-card.tsx";

export interface RowItem {
	href: string;
	id: string;
	image: string | null;
	mediaType: CardMediaType;
	overview: string;
	stat: CardStat;
	title: string;
	year: string;
}

export const MediaRow = ({
	items,
	title,
}: {
	items: RowItem[];
	title: string;
}) => (
	<section>
		<h2 className="mb-3 text-2xl font-semibold">{title}</h2>
		<div className="flex gap-4 overflow-x-auto pb-2">
			{items.map((item) => (
				<MediaCard
					href={item.href}
					image={item.image}
					key={item.id}
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
