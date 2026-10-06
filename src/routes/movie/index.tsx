// oxlint-disable react/function-component-definition func-style
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/movie/")({
	component: MoviesPage,
});

function MoviesPage() {
	return <div>Hello "/movie/"!</div>;
}
