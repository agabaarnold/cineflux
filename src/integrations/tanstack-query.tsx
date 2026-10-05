import { QueryClient } from "@tanstack/react-query";

import { GC_TIME, STALE_TIME } from "#/lib/tmdb-query-cache.ts";

export const getContext = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				gcTime: GC_TIME.default,
				staleTime: STALE_TIME.default,
			},
		},
	});

	return {
		queryClient,
	};
};
