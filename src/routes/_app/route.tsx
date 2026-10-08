// oxlint-disable react/function-component-definition func-style
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Navbar } from "#/components/layout/navbar.tsx";
import { fetchSession } from "#/server/functions/auth.ts";

export const Route = createFileRoute("/_app")({
	beforeLoad: async () => {
		try {
			const { user } = await fetchSession();
			return { user };
		} catch (error) {
			console.error("Failed to fetch session, continuing as guest:", error);
			return { user: null };
		}
	},
	component: AppLayout,
});

function AppLayout() {
	const { user } = Route.useRouteContext();
	return (
		<>
			<Navbar user={user} />
			<Outlet />
		</>
	);
}
