// oxlint-disable react/function-component-definition func-style
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tv/$tvId")({
	component: TvShowLayout,
});

function TvShowLayout() {
	return <Outlet />;
}
