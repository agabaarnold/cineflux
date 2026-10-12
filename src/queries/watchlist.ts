import { queryOptions } from "@tanstack/react-query";

import { fetchWatchlist } from "#/server/functions/watchlist.ts";

/**
 * `userId` is `null` while the session is still resolving or when the visitor
 * is a guest. The gate lives here so callers cannot accidentally enable the
 * query against an unknown user id.
 */
export const fetchWatchlistQueryOptions = (userId: string | null) =>
	queryOptions({
		enabled: userId !== null,
		queryFn: () => fetchWatchlist(),
		queryKey: ["watchlist", userId],
		staleTime: 0,
	});
