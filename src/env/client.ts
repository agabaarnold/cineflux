import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const clientEnv = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_SITE_URL: z
			.url()
			.refine(
				(value) => {
					const parsed = new URL(value);
					return parsed.pathname === "/" && !parsed.search && !parsed.hash;
				},
				{
					message:
						"VITE_SITE_URL must be an origin URL without a path, query, or fragment",
				}
			)
			.optional(),
	},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});
