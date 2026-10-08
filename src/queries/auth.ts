import { queryOptions } from "@tanstack/react-query";

import { fetchAuthProviders } from "#/server/functions/auth.ts";

export const fetchAuthProvidersQueryOptions = () =>
	queryOptions({
		queryKey: ["auth", "providers"],
		queryFn: () => fetchAuthProviders(),
		staleTime: Infinity,
	});
