import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const serverEnv = createEnv({
	server: {
		BETTER_AUTH_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(1),
		DATABASE_URL: z.url(),
		GOOGLE_CLIENT_ID: z.string().min(1).optional(),
		GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		TMDB_API_KEY: z.string().min(1),
		TMDB_READ_ACCESS_TOKEN: z.string().min(1),
		TMDB_BASE_URL: z.url(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
