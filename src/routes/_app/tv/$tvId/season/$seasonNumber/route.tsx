// oxlint-disable react/function-component-definition func-style
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/tv/$tvId/season/$seasonNumber")({
	component: SeasonLayout,
});

function SeasonLayout() {
	return <Outlet />;
}
