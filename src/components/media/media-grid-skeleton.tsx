import { Skeleton } from "#/components/ui/skeleton.tsx";

export const MediaGridSkeleton = ({
	compact = false,
	gap = "gap-3",
	title,
}: {
	compact?: boolean;
	gap?: string;
	title: string;
}) => (
	<section
		aria-label={`${title} loading`}
		aria-busy="true"
		className={compact ? "mx-auto mb-4 w-full" : "mx-auto mt-20 mb-4"}
	>
		<span className="sr-only">Loading {title}</span>
		{title ? (
			<h2 className="mb-5 text-center text-xl font-semibold uppercase">
				{title}
			</h2>
		) : null}

		<div
			aria-hidden="true"
			className={`grid grid-cols-2 ${gap} sm:grid-cols-3 lg:grid-cols-4`}
		>
			{Array.from({ length: 12 }, (_, index) => (
				<div
					className="w-40 shrink-0 sm:w-44"
					key={`media-grid-skeleton-${index}`}
				>
					<div className="bg-card h-full overflow-hidden rounded-2xl border">
						<Skeleton className="aspect-2/3 w-full" />
						<div className="p-4">
							<Skeleton className="h-5 w-3/4" />
							<Skeleton className="mt-2 h-4 w-1/2" />
							<Skeleton className="mt-2 h-15 w-full" />
						</div>
					</div>
				</div>
			))}
		</div>
	</section>
);
