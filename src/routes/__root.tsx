// oxlint-disable react/function-component-definition func-style
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "react-hot-toast";

import { TooltipProvider } from "#/components/ui/tooltip.tsx";

import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "description",
				content: "Discover movies, TV shows, and people.",
			},
			{
				name: "theme-color",
				content: "#6D25D9",
			},
			{
				content: "CineFlux",
				property: "og:site_name",
			},
			{
				content: "website",
				property: "og:type",
			},
			{
				content: "summary",
				name: "twitter:card",
			},
			{
				title: "CineFlux",
			},
		],
		links: [
			{
				rel: "preconnect",
				href: "https://image.tmdb.org",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/favicon.ico",
			},
			{
				rel: "icon",
				href: "/app-icon.svg",
				type: "image/svg+xml",
			},
			{
				rel: "icon",
				href: "/favicon-32.png",
				sizes: "32x32",
				type: "image/png",
			},
			{
				rel: "icon",
				href: "/favicon-16.png",
				sizes: "16x16",
				type: "image/png",
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon-180.png",
			},
			{
				rel: "manifest",
				href: "/site.webmanifest",
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>

			<body>
				<a
					className="absolute -top-24 left-4 z-[60] rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all focus:top-4"
					href="#main-content"
				>
					Skip to content
				</a>
				<TooltipProvider>{children}</TooltipProvider>
				<Toaster />

				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						{ name: "Tanstack Query", render: <ReactQueryDevtoolsPanel /> },
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
