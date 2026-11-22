import { Skeleton } from "#/components/ui/skeleton.tsx";

export const MediaRowSkeleton = ({ title }: { title: string }) => (
	<section aria-busy="true" aria-label={`${title} loading`} className="w-full">
		<span className="sr-only">Loading {title}</span>
		<h2 className="mb-3 text-2xl font-semibold">{title}</h2>
		<div
			aria-hidden="true"
			className="scroll-snap-x flex snap-mandatory gap-4 overflow-hidden pb-2"
		>
			{Array.from({ length: 6 }, (_, index) => (
				<div
					className="w-40 shrink-0 snap-start sm:w-44"
					key={`media-row-skeleton-${index}`}
				>
					<div className="bg-card h-full overflow-hidden rounded-2xl border">
						<Skeleton className="aspect-[2/3] w-full" />
						<div className="p-4">
							<Skeleton className="h-5 w-3/4" />
							<Skeleton className="mt-2 h-4 w-1/2" />
							<Skeleton className="mt-2 h-[3.75rem] w-full" />
						</div>
					</div>
				</div>
			))}
		</div>
	</section>
);
