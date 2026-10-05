// oxlint-disable shadcn/no-restyle
import {
	IconDeviceTv,
	IconHome,
	IconMovie,
	IconSearch,
	IconSun,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { LinkOptions } from "@tanstack/react-router";
import { cn } from "cn";

import { Logo } from "../shared/logo";
import { Button } from "../ui/button";

interface NavItemProps {
	to: LinkOptions["to"];
	children: React.ReactNode;
	icon?: Icon;
}

const NavItem = ({ to, children, icon: Icon }: NavItemProps) => (
	<Link
		to={to}
		className={cn(
			"flex h-9 items-center gap-2 rounded-full px-3",
			"text-primary/75 text-sm font-medium",
			"transition-colors duration-200"
		)}
		activeProps={{ className: "bg-primary text-secondary" }}
		inactiveProps={{
			className: "hover:bg-accent hover:text-accent-foreground",
		}}
	>
		{Icon && <Icon className="size-4" />}

		<span>{children}</span>
	</Link>
);

export const Navbar = () => (
	<header className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4">
		<nav className="border-border/70 bg-card/80 supports-backdrop-filter:bg-card/65 pointer-events-auto flex h-12 items-center gap-2.5 rounded-full border p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl">
			<Link to="/">
				<Logo className="size-10" />
			</Link>

			<div className="hidden items-center gap-1.5 sm:flex">
				<NavItem to="/" icon={IconHome}>
					Home
				</NavItem>

				<NavItem to="/movie" icon={IconMovie}>
					Movies
				</NavItem>

				<NavItem to="/tv" icon={IconDeviceTv}>
					TV Shows
				</NavItem>
			</div>

			{/* Implement theming */}
			<Button
				className="bg-accent rounded-full p-2"
				type="button"
				variant="outline"
			>
				<IconSun />
			</Button>

			<Link
				to="/search"
				className="text-primary/75 hover:bg-accent hover:text-accent-foreground flex size-9 items-center justify-center rounded-full transition-colors"
				activeProps={{ className: "bg-primary text-secondary" }}
			>
				<IconSearch className="size-4" />
			</Link>

			{/* Profile goes here */}
		</nav>
	</header>
);
