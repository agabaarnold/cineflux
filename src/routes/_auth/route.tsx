// oxlint-disable react/function-component-definition func-style
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { fetchSession } from "#/server/functions/auth.ts";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async () => {
		const { user } = await fetchSession().catch(() => ({ user: null }));
		if (user) {
			throw redirect({ to: "/" });
		}
		return {};
	},
	component: AuthLayout,
});

function AuthLayout() {
	return <Outlet />;
}
