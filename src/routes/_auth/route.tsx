// oxlint-disable react/function-component-definition func-style
import {
	createFileRoute,
	isRedirect,
	Outlet,
	redirect,
} from "@tanstack/react-router";

import { fetchSession } from "#/server/functions/auth.ts";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async () => {
		try {
			const { user } = await fetchSession();
			if (user) {
				throw redirect({ to: "/" });
			}
		} catch (error) {
			if (isRedirect(error)) {
				throw error;
			}
		}
		return {};
	},
	component: AuthLayout,
});

function AuthLayout() {
	return <Outlet />;
}
