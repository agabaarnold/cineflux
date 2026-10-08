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
	const userId = session?.user.id ?? "";
	const { data: entries } = useQuery({
		...fetchWatchlistQueryOptions(userId),
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
				queryClient.setQueryData(["watchlist", userId], context.previous);
			}
			toast.error(error.message ?? "Something went wrong");
		},
		onMutate: async (currentlySaved: boolean) => {
			await queryClient.cancelQueries({ queryKey: ["watchlist", userId] });
			const previous = queryClient.getQueryData<WatchlistEntries>([
				"watchlist",
				userId,
			]);
			queryClient.setQueryData<WatchlistEntries>(
				["watchlist", userId],
				(old) => {
					if (!old) {
						return currentlySaved ? old : [{ mediaId, mediaType }];
					}
					const exists = old.some(
						(entry) =>
							entry.mediaType === mediaType && entry.mediaId === mediaId
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
				}
			);
			return { previous };
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
	});

	const saved = session
		? (entries?.some(
				(entry) => entry.mediaType === mediaType && entry.mediaId === mediaId
			) ?? false)
		: false;

	const toggle = () => {
		if (!session) {
			navigate({ to: "/sign-in" });
			return;
		}
		mutate(saved);
	};

	return { isPending, saved, toggle };
};
