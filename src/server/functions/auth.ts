import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth, isGoogleEnabled } from "#/lib/auth.ts";

export const fetchAuthProviders = createServerFn({ method: "GET" }).handler(
	() => ({ google: isGoogleEnabled })
);

export const fetchSession = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await auth.api.getSession({
			headers: getRequestHeaders(),
		});
		if (!session) {
			return { user: null };
		}
		const { email, image, name } = session.user;
		return { user: { email, image: image ?? null, name } };
	}
);
