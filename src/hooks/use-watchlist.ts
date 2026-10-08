import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import type { CardMediaType } from "#/components/media/media-card.tsx";
import { authClient } from "#/lib/auth-client.ts";
import { fetchWatchlistQueryOptions } from "#/queries/watchlist.ts";
import {
	addToWatchlist,
	removeFromWatchlist,
} from "#/server/functions/watchlist.ts";
import type { fetchWatchlist } from "#/server/functions/watchlist.ts";

type WatchlistEntries = Awaited<ReturnType<typeof fetchWatchlist>>;
interface WatchlistContext {
	previous: WatchlistEntries | undefined;
}

export const useWatchlistItem = (mediaType: CardMediaType, mediaId: number) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();
	const { data: entries } = useQuery({
		...fetchWatchlistQueryOptions(),
		enabled: session !== null,
	});

	const { isPending, mutate } = useMutation<
		{ ok: boolean },
		Error,
		boolean,
		WatchlistContext
	>({
		mutationFn: (currentlySaved: boolean) =>
			currentlySaved
				? removeFromWatchlist({ data: { mediaId, mediaType } })
				: addToWatchlist({ data: { mediaId, mediaType } }),
		onError: (error, _variables, context) => {
			if (context?.previous !== undefined) {
				queryClient.setQueryData(["watchlist"], context.previous);
			}
			toast.error(error.message ?? "Something went wrong");
		},
		onMutate: async (currentlySaved: boolean) => {
			await queryClient.cancelQueries({ queryKey: ["watchlist"] });
			const previous = queryClient.getQueryData<WatchlistEntries>([
				"watchlist",
			]);
			queryClient.setQueryData<WatchlistEntries>(["watchlist"], (old) => {
				if (!old) {
					return currentlySaved ? old : [{ mediaId, mediaType }];
				}
				const exists = old.some(
					(entry) => entry.mediaType === mediaType && entry.mediaId === mediaId
				);
				if (currentlySaved && exists) {
					return old.filter(
						(entry) =>
							!(entry.mediaType === mediaType && entry.mediaId === mediaId)
					);
				}
				if (!currentlySaved && !exists) {
					return [...old, { mediaId, mediaType }];
				}
				return old;
			});
			return { previous };
		},
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

	return { isPending, saved, toggle };
};
