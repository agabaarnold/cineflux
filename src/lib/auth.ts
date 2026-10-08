import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import { haveIBeenPwned } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "#/db";
import { schema } from "#/db/schema";
import { serverEnv } from "#/env/server.ts";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = serverEnv;

if (
	(GOOGLE_CLIENT_ID === undefined) !== (GOOGLE_CLIENT_SECRET === undefined)
) {
	throw new Error(
		"GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must either both be set or both be unset."
	);
}

const googleCredentials =
	GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
		? { clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET }
		: undefined;

export const isGoogleEnabled = googleCredentials !== undefined;

const getSocialProviders = () => {
	if (!googleCredentials) {
		return {};
	}
	return { google: googleCredentials };
};

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: getSocialProviders(),
	plugins: [haveIBeenPwned(), tanstackStartCookies()],
});

export type User = typeof auth.$Infer.Session.user;
