// oxlint-disable react/function-component-definition func-style
import { createFileRoute, Link } from "@tanstack/react-router";

import { pageHead, pageTitle } from "#/lib/seo.ts";

const categories = [
	{
		label: "Trending",
		description: "What's popular right now",
		to: "/movie/trending",
	},
	{
		label: "Popular",
		description: "Most watched movies",
		to: "/movie/popular",
	},
	{
		label: "Now Playing",
		description: "In theaters now",
		to: "/movie/now-playing",
	},
	{
		label: "Top Rated",
		description: "Critically acclaimed",
		to: "/movie/top-rated",
	},
	{
		label: "Upcoming",
		description: "Coming soon",
		to: "/movie/upcoming",
	},
] as const;

export const Route = createFileRoute("/_app/movie/")({
	component: MoviesLandingPage,
	head: () =>
		pageHead({
			description:
				"Browse popular, top-rated, and upcoming movies on CineFlux.",
			path: "/movie",
			title: pageTitle("Movies"),
		}),
});

function MoviesLandingPage() {
	return (
		<div className="flex flex-col">
			<div className="mx-auto w-full max-w-7xl space-y-10 px-4 pt-24 pb-6">
				<div>
					<h1 className="text-3xl font-bold">Movies</h1>
					<p className="text-muted-foreground mt-1">
						Discover great films across every category.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{categories.map((category) => (
						<Link
							key={category.label}
							className="group bg-card hover:border-primary/50 block rounded-2xl border p-6 transition-all hover:shadow-lg"
							to={category.to}
						>
							<div className="flex items-start gap-4">
								<div className="shrink-0">
									{category.label === "Trending" && (
										<span className="text-4xl">🔥</span>
									)}
									{category.label === "Popular" && (
										<span className="text-4xl">📈</span>
									)}
									{category.label === "Now Playing" && (
										<span className="text-4xl">🎬</span>
									)}
									{category.label === "Top Rated" && (
										<span className="text-4xl">⭐</span>
									)}
									{category.label === "Upcoming" && (
										<span className="text-4xl">🆕</span>
									)}
								</div>
								<div>
									<h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
										{category.label}
									</h3>
									<p className="text-muted-foreground mt-1 text-sm">
										{category.description}
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
