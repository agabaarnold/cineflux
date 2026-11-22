import { MediaCard } from "#/components/media/media-card.tsx";
import type { RowItem } from "#/components/media/media-row.tsx";

export const MediaGrid = ({
	items,
	title,
	gap = "gap-3",
	description,
}: {
	items: RowItem[];
	title: string;
	gap?: string;
	description?: string;
}) => (
	<section className="mx-auto mt-20 mb-4 w-full max-w-7xl px-4">
		{title ? (
			<div className="mb-5 text-center">
				<h2 className="text-xl font-semibold uppercase">{title}</h2>
				{description ? (
					<p className="text-muted-foreground mx-auto mt-1 max-w-xl text-sm">
						{description}
					</p>
				) : null}
			</div>
		) : null}

		<div className={`grid grid-cols-2 ${gap} sm:grid-cols-3 lg:grid-cols-4`}>
			{items.map((item) => (
				<MediaCard
					grid
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
