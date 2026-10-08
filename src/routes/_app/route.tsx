// oxlint-disable react/function-component-definition func-style
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Navbar } from "#/components/layout/navbar.tsx";
import { fetchSession } from "#/server/functions/auth.ts";

export const Route = createFileRoute("/_app")({
	beforeLoad: async () => {
		const { user } = await fetchSession();
		return { user };
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
