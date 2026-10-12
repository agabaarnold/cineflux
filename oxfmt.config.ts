import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
	...ultracite,
	useTabs: true,
	ignore: ["src/routeTree.gen.ts"],
});
