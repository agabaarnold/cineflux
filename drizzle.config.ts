// oxlint-disable anti-slop/require-safety-comment-for-type-assertion
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.local", ".env"] });

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema/*.schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
});
