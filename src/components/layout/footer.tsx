import { Link } from "@tanstack/react-router";

import { Logo } from "../shared/logo";

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => (
	<footer className="border-border/70 bg-card/80 supports-backdrop-filter:bg-card/65 border-t py-8 backdrop-blur-xl">
		<div className="mx-auto w-full max-w-7xl px-4">
			<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
				<div className="flex items-center gap-2">
					<Link to="/">
						<Logo className="size-8" aria-hidden="true" />
					</Link>
					<span className="text-xl font-bold tracking-tight sm:hidden">
						CineFlux
					</span>
				</div>
				<nav className="flex flex-wrap justify-center gap-4">
					<Link
						className="text-muted-foreground hover:text-foreground text-sm transition-colors"
						to="/"
					>
						Home
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground text-sm transition-colors"
						to="/discover"
					>
						Discover
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground text-sm transition-colors"
						to="/movie"
					>
						Movies
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground text-sm transition-colors"
						to="/tv"
					>
						TV Shows
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground text-sm transition-colors"
						to="/people"
					>
						People
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground text-sm transition-colors"
						to="/search"
					>
						Search
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground text-sm transition-colors"
						to="/watchlist"
					>
						Watchlist
					</Link>
				</nav>
			</div>
			<p className="text-muted-foreground mt-6 text-center text-sm">
				&copy; {CURRENT_YEAR} CineFlux. Built with TMDB data.
			</p>
		</div>
	</footer>
);
