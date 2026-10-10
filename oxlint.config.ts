import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import { jsPluginSettings, selectJsPlugins } from "ultracite/oxlint/js-plugins";
import react from "ultracite/oxlint/react";
import shadcn from "ultracite/oxlint/shadcn";
import tanstack from "ultracite/oxlint/tanstack";
import tanstackJsPlugins from "ultracite/oxlint/tanstack/js-plugins";

const jsPlugins = selectJsPlugins(["github", "sonarjs", "react-doctor"]);

export default defineConfig({
	extends: [
		core,
		react,
		tanstack,
		tanstackJsPlugins,
		shadcn,
		antiSlop,
		jsPlugins,
	],
	ignorePatterns: core.ignorePatterns,
	jsPlugins: [...jsPlugins.jsPlugins, ...shadcn.jsPlugins],
	settings: jsPluginSettings,
	overrides: [
		{
			// TanStack Start requires uppercase HTTP method names for server handlers.
			files: ["src/routes/api/auth/$.ts"],
			rules: {
				"sonarjs/function-name": "off",
			},
		},
	],
});
