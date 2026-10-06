// oxlint-disable react/function-component-definition func-style
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/people/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/people/"!</div>;
}
