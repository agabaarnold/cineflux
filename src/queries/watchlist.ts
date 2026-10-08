import { queryOptions } from "@tanstack/react-query";

import { fetchWatchlist } from "#/server/functions/watchlist.ts";

export const fetchWatchlistQueryOptions = () =>
	queryOptions({
		queryFn: () => fetchWatchlist(),
		queryKey: ["watchlist"],
		staleTime: 0,
	});
