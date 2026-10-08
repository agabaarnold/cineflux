import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import type { CardMediaType } from "#/components/media/media-card.tsx";
import { authClient } from "#/lib/auth-client.ts";
import { fetchWatchlistQueryOptions } from "#/queries/watchlist.ts";
import {
	addToWatchlist,
	removeFromWatchlist,
} from "#/server/functions/watchlist.ts";

export const useWatchlistItem = (mediaType: CardMediaType, mediaId: number) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();
	const { data: entries } = useQuery({
		...fetchWatchlistQueryOptions(),
		enabled: session !== null,
	});

	const { mutate } = useMutation({
		mutationFn: (nextSaved: boolean) =>
			nextSaved
				? removeFromWatchlist({ data: { mediaId, mediaType } })
				: addToWatchlist({ data: { mediaId, mediaType } }),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
	});

	const saved =
		entries?.some(
			(entry) => entry.mediaType === mediaType && entry.mediaId === mediaId
		) ?? false;

	const toggle = () => {
		if (!session) {
			navigate({ to: "/sign-in" });
			return;
		}
		mutate(saved);
	};

	return { saved, toggle };
};
