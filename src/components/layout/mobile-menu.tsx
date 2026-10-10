import {
	IconBookmark,
	IconDeviceTv,
	IconHome,
	IconMenu2,
	IconMoon,
	IconMovie,
	IconSearch,
	IconSun,
	IconUsersGroup,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import type { NavbarUser } from "#/components/layout/navbar.tsx";
import { useTheme } from "#/hooks/use-theme.tsx";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet.tsx";

import { Logo } from "../shared/logo";

const menuLinks = [
	{ icon: IconHome, label: "Home", to: "/" },
	{ icon: IconMovie, label: "Movies", to: "/movie" },
	{ icon: IconDeviceTv, label: "TV Shows", to: "/tv" },
	{ icon: IconUsersGroup, label: "People", to: "/people" },
	{ icon: IconSearch, label: "Search", to: "/search" },
] as const;

export const MobileMenu = ({ user }: { user: NavbarUser | null }) => {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const { theme, toggle } = useTheme();
	const dark = theme === "dark";

	return (
		<div className="sm:hidden">
			<Sheet onOpenChange={setOpen} open={open}>
				<SheetTrigger
					render={
						<button
							aria-label="Open menu"
							className="text-primary/75 hover:bg-accent hover:text-accent-foreground flex size-9 items-center justify-center rounded-full transition-colors"
							type="button"
						/>
					}
				>
					<IconMenu2 aria-hidden="true" className="size-4" />
				</SheetTrigger>
				<SheetContent side="left">
					<SheetHeader>
						<SheetTitle>
							<span className="flex items-center gap-2">
								<Logo aria-hidden="true" className="size-7" />
								CineFlux
							</span>
						</SheetTitle>
					</SheetHeader>
					<nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
						{menuLinks.map((link) => (
							<Link
								className="hover:bg-accent hover:text-accent-foreground flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors"
								key={link.to}
								onClick={close}
								to={link.to}
							>
								<link.icon aria-hidden="true" className="size-4" />
								{link.label}
							</Link>
						))}
						{user ? (
							<Link
								className="hover:bg-accent hover:text-accent-foreground flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors"
								onClick={close}
								to="/watchlist"
							>
								<IconBookmark aria-hidden="true" className="size-4" />
								My watchlist
							</Link>
						) : (
							<Link
								className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 flex h-11 items-center justify-center rounded-xl px-3 text-sm font-medium transition-colors"
								onClick={close}
								to="/sign-in"
							>
								Sign in
							</Link>
						)}
						<button
							aria-pressed={dark}
							className="hover:bg-accent hover:text-accent-foreground flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors"
							onClick={toggle}
							type="button"
						>
							{dark ? (
								<IconSun aria-hidden="true" className="size-4" />
							) : (
								<IconMoon aria-hidden="true" className="size-4" />
							)}
							{dark ? "Light mode" : "Dark mode"}
						</button>
					</nav>
				</SheetContent>
			</Sheet>
		</div>
	);
};
