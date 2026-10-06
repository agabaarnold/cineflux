// oxlint-disable react/function-component-definition func-style
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tv/")({
	component: TVShowsPage,
});

function TVShowsPage() {
	return <div>Hello "/tv/"!</div>;
}
