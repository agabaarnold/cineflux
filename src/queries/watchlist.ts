import { queryOptions } from "@tanstack/react-query";

import { fetchWatchlist } from "#/server/functions/watchlist.ts";

export const fetchWatchlistQueryOptions = (userId: string) =>
	queryOptions({
		queryFn: () => fetchWatchlist(),
		queryKey: ["watchlist", userId],
		staleTime: 0,
	});
