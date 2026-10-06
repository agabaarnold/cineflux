// oxlint-disable react/function-component-definition func-style
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/people/")({
	component: PeoplePage,
});

function PeoplePage() {
	return <div>Hello "/people/"!</div>;
}
