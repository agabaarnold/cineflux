import { MediaCard } from "#/components/media/media-card.tsx";
import type { RowItem } from "#/components/media/media-row.tsx";

export const MediaGrid = ({
	items,
	title,
}: {
	items: RowItem[];
	title: string;
}) => (
	<section>
		{title ? <h2 className="mb-4 text-2xl font-semibold">{title}</h2> : null}
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{items.map((item) => (
				<MediaCard
					key={item.id}
					href={item.href}
					image={item.image}
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
