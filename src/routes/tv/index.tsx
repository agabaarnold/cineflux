// oxlint-disable react/function-component-definition func-style
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tv/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/tv/"!</div>;
}
