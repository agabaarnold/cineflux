// oxlint-disable shadcn/no-restyle
import {
	IconDeviceTv,
	IconHome,
	IconLogout,
	IconMovie,
	IconSearch,
	IconUsersGroup,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { LinkOptions } from "@tanstack/react-router";
import { cn } from "cn";

import { authClient } from "#/lib/auth-client.ts";

import { Logo } from "../shared/logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
		{Icon && <Icon aria-hidden="true" className="size-4" />}

		<span>{children}</span>
	</Link>
);

export interface NavbarUser {
	email: string;
	image: string | null;
	name: string;
}

const ProfileControl = ({ user }: { user: NavbarUser | null }) => {
	const navigate = useNavigate();

	if (!user) {
		return (
			<Link
				className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors"
				to="/sign-in"
			>
				Sign in
			</Link>
		);
	}

	const initials = user.name
		.split(" ")
		.map((part) => part[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label="Profile menu"
				className="ring-foreground/15 hover:ring-foreground/30 rounded-full ring-1 transition outline-none"
			>
				<Avatar>
					{user.image ? <AvatarImage alt={user.name} src={user.image} /> : null}
					<AvatarFallback className="bg-primary text-primary-foreground font-semibold">
						{initials || "?"}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={8}>
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<p className="text-foreground truncate text-sm font-semibold">
							{user.name}
						</p>
						<p className="truncate text-xs">{user.email}</p>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={async () => {
						await authClient.signOut();
						navigate({ to: "/" });
					}}
				>
					<IconLogout aria-hidden="true" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const Navbar = ({ user }: { user: NavbarUser | null }) => (
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

				<NavItem to="/people" icon={IconUsersGroup}>
					People
				</NavItem>
			</div>

			<Link
				aria-label="Search"
				to="/search"
				className="text-primary/75 hover:bg-accent hover:text-accent-foreground flex size-9 items-center justify-center rounded-full transition-colors"
				activeProps={{ className: "bg-primary text-secondary" }}
			>
				<IconSearch aria-hidden="true" className="size-4" />
			</Link>

			<ProfileControl user={user} />
		</nav>
	</header>
);
