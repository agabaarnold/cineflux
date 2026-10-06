import {
	IconAlertTriangle,
	IconCloudOff,
	IconHome,
	IconRotateClockwise,
	IconSearchOff,
	IconWifiOff,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { Button, buttonVariants } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";

interface ErrorContent {
	code: string;
	hint?: string;
	icon: typeof IconCloudOff;
	message: string;
	title: string;
}

export const RouteError = ({
	error,
	reset,
}: {
	error: unknown;
	reset?: () => void;
}) => {
	// SAFETY: ApiError always carries a numeric status; narrowed from Error first.
	const status =
		error instanceof Error && error.name === "ApiError"
			? (error as { status?: unknown }).status
			: undefined;
	let content: ErrorContent = {
		code: "!",
		icon: IconCloudOff,
		message: "Something went wrong loading this page.",
		title: "Couldn't load this page",
	};

	if (status === 404) {
		content = {
			code: "404",
			icon: IconSearchOff,
			message:
				"This title may have been removed from TMDB, or the link is stale.",
			title: "Title not found",
		};
	} else if (status === 502) {
		content = {
			code: "502",
			hint: "The schemas may need updating for this response.",
			icon: IconAlertTriangle,
			message: "TMDB answered in a shape we don't recognize.",
			title: "Unexpected data",
		};
	} else if (status === 504) {
		content = {
			code: "504",
			icon: IconWifiOff,
			message: "TMDB didn't answer in time. Check your connection and retry.",
			title: "Taking too long",
		};
	}

	const Icon = content.icon;
	const retry = () => {
		if (reset) {
			reset();
		} else {
			window.location.reload();
		}
	};

	return (
		<div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 py-16 text-center">
			<span className="bg-destructive/10 text-destructive flex size-16 items-center justify-center rounded-full">
				<Icon className="size-8" />
			</span>

			<p className="text-foreground/15 text-7xl font-black tracking-tight">
				{content.code}
			</p>

			<h1 className="-mt-4 text-2xl font-bold">{content.title}</h1>

			<p className="text-muted-foreground mt-2">{content.message}</p>

			{content.hint ? (
				<p className="text-muted-foreground mt-1 text-sm">{content.hint}</p>
			) : null}

			<div className="mt-6 flex items-center gap-3">
				<Button onClick={retry} type="button">
					<IconRotateClockwise className="size-4" />
					Try again
				</Button>

				<Link className={cn(buttonVariants({ variant: "outline" }))} to="/">
					<IconHome className="size-4" />
					Go home
				</Link>
			</div>
		</div>
	);
};
