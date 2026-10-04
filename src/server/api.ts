import { create } from "axios";

import { serverEnv } from "#/env/server.ts";

const api = create({
	baseURL: serverEnv.TMDB_BASE_URL,
	headers: {
		Authorization: `Bearer ${serverEnv.TMDB_READ_ACCESS_TOKEN}`,
		"Content-Type": "application/json",
	},
});

export default api;
