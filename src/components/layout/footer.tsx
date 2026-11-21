import { Link } from "@tanstack/react-router";

import { Logo } from "../shared/logo";

export const Footer = () => (
	<footer className="border-t border-border/70 bg-card/80 supports-backdrop-filter:bg-card/65 backdrop-blur-xl py-8">
		<div className="mx-auto w-full max-w-7xl px-4">
			<div className="flex flex-col md:flex-row justify-between items-center gap-4">
				<div className="flex items-center gap-2">
					<Link to="/">
						<Logo className="size-8" aria-hidden="true" />
					</Link>
					<span className="font-bold text-xl tracking-tight sm:hidden">
						CineFlux
					</span>
				</div>
				<nav className="flex flex-wrap justify-center gap-4">
					<Link
						className="text-muted-foreground hover:text-foreground transition-colors text-sm"
						to="/"
					>
						Home
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground transition-colors text-sm"
						to="/movie"
					>
						Movies
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground transition-colors text-sm"
						to="/tv"
					>
						TV Shows
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground transition-colors text-sm"
						to="/people"
					>
						People
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground transition-colors text-sm"
						to="/search"
					>
						Search
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground transition-colors text-sm"
						to="/watchlist"
					>
						Watchlist
					</Link>
				</nav>
			</div>
			<p className="mt-6 text-center text-muted-foreground text-sm">
				&copy; {new Date().getFullYear()} CineFlux. Built with TMDB data.
			</p>
		</div>
	</footer>
);
