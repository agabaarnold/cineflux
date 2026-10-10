import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth } from "#/lib/auth.ts";

export const requireUserId = async (): Promise<string> => {
	const session = await auth.api.getSession({ headers: getRequestHeaders() });
	if (!session) {
		throw new Error("Unauthorized");
	}
	return session.user.id;
};
