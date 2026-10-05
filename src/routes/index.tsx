import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { fetchTrendingQueryOptions } from "#/queries/trending.ts";
import type { TrendingAll } from "#/schemas/trending.ts";

const trendingOptions = fetchTrendingQueryOptions({
	data: { language: "en-US", media_type: "all", time_window: "week" },
});

const TrendingItem = ({ item }: { item: TrendingAll }) => {
	if (item.media_type === "movie") {
		return (
			<>
				{item.title} <span>({item.release_date})</span>
			</>
		);
	}
	if (item.media_type === "tv") {
		return (
			<>
				{item.name} <span>({item.first_air_date})</span>
			</>
		);
	}
	return (
		<>
			{item.name} <span>({item.known_for_department})</span>
		</>
	);
};

const Home = () => {
	const { data } = useSuspenseQuery(trendingOptions);

	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Trending this week</h1>
			<ul className="mt-4 space-y-2">
				{data.results.map((item) => (
					<li key={`${item.media_type}-${item.id}`}>
						<TrendingItem item={item} />
					</li>
				))}
			</ul>
		</div>
	);
};

export const Route = createFileRoute("/")({
	component: Home,
	loader: ({ context }) => context.queryClient.ensureQueryData(trendingOptions),
});
