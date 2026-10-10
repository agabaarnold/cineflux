import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useWatchlistItem } from "#/hooks/use-watchlist.ts";

const mocks: {
	navigate: ReturnType<typeof vi.fn>;
	session: { data: { user: { id: string } } | null };
} = vi.hoisted(() => ({
	navigate: vi.fn(),
	session: { data: null },
}));

// Module mocks isolate the hook: server functions need Postgres, the router
// needs the full route tree, and toast needs a mounted provider.
// oxlint-disable-next-line anti-slop/no-module-mocking
vi.mock("#/server/functions/watchlist.ts", () => ({
	addToWatchlist: vi.fn(),
	fetchWatchlist: vi.fn(),
	removeFromWatchlist: vi.fn(),
}));

// Same isolation rationale as above.
// oxlint-disable-next-line anti-slop/no-module-mocking
vi.mock("#/lib/auth-client.ts", () => ({
	authClient: { useSession: () => mocks.session },
}));

// Same isolation rationale as above.
// oxlint-disable-next-line anti-slop/no-module-mocking
vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => mocks.navigate,
}));

// Same isolation rationale as above.
// oxlint-disable-next-line anti-slop/no-module-mocking
vi.mock("react-hot-toast", () => ({
	toast: { error: vi.fn(), success: vi.fn() },
}));

let queryClient: QueryClient;

const Wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
	vi.clearAllMocks();
	mocks.session = { data: null };
	queryClient = new QueryClient({
		defaultOptions: {
			mutations: { retry: false },
			queries: { retry: false },
		},
	});
});

const signIn = () => {
	mocks.session = { data: { user: { id: "user-1" } } };
};

describe("useWatchlistItem", () => {
	it("adds an unsaved title with an optimistic flip and success toast", async () => {
		const { addToWatchlist, fetchWatchlist } =
			await import("#/server/functions/watchlist.ts");
		const { toast } = await import("react-hot-toast");
		const store: { mediaId: number; mediaType: "movie" | "person" | "tv" }[] =
			[];
		vi.mocked(fetchWatchlist).mockImplementation(() =>
			Promise.resolve([...store])
		);
		vi.mocked(addToWatchlist).mockImplementation(({ data }) => {
			store.push(data);
			return Promise.resolve({ ok: true });
		});
		signIn();

		const { result } = renderHook(() => useWatchlistItem("movie", 550), {
			wrapper: Wrapper,
		});
		await waitFor(() => expect(result.current.saved).toBe(false));

		act(() => {
			result.current.toggle();
		});

		await waitFor(() => expect(result.current.saved).toBe(true));
		expect(vi.mocked(addToWatchlist)).toHaveBeenCalledWith({
			data: { mediaId: 550, mediaType: "movie" },
		});
		expect(vi.mocked(toast.success)).toHaveBeenCalledWith("Saved to watchlist");
	});

	it("removes a saved title", async () => {
		const { fetchWatchlist, removeFromWatchlist } =
			await import("#/server/functions/watchlist.ts");
		const { toast } = await import("react-hot-toast");
		const store: { mediaId: number; mediaType: "movie" | "person" | "tv" }[] = [
			{ mediaId: 550, mediaType: "movie" },
		];
		vi.mocked(fetchWatchlist).mockImplementation(() =>
			Promise.resolve([...store])
		);
		vi.mocked(removeFromWatchlist).mockImplementation(({ data }) => {
			const index = store.findIndex(
				(item) =>
					item.mediaId === data.mediaId && item.mediaType === data.mediaType
			);
			if (index !== -1) {
				store.splice(index, 1);
			}
			return Promise.resolve({ ok: true });
		});
		signIn();

		const { result } = renderHook(() => useWatchlistItem("movie", 550), {
			wrapper: Wrapper,
		});
		await waitFor(() => expect(result.current.saved).toBe(true));

		act(() => {
			result.current.toggle();
		});

		await waitFor(() => expect(result.current.saved).toBe(false));
		expect(vi.mocked(removeFromWatchlist)).toHaveBeenCalledWith({
			data: { mediaId: 550, mediaType: "movie" },
		});
		expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
			"Removed from watchlist"
		);
	});

	it("rolls back the optimistic flip and toasts on error", async () => {
		const { addToWatchlist, fetchWatchlist } =
			await import("#/server/functions/watchlist.ts");
		const { toast } = await import("react-hot-toast");
		vi.mocked(fetchWatchlist).mockResolvedValue([]);
		vi.mocked(addToWatchlist).mockRejectedValue(new Error("Nope"));
		signIn();

		const { result } = renderHook(() => useWatchlistItem("movie", 550), {
			wrapper: Wrapper,
		});
		await waitFor(() => expect(result.current.saved).toBe(false));

		act(() => {
			result.current.toggle();
		});

		await waitFor(() =>
			expect(vi.mocked(toast.error)).toHaveBeenCalledWith("Nope")
		);
		await waitFor(() => expect(result.current.saved).toBe(false));
	});

	it("redirects guests to sign-in without mutating", async () => {
		const { addToWatchlist, fetchWatchlist } =
			await import("#/server/functions/watchlist.ts");
		vi.mocked(fetchWatchlist).mockResolvedValue([]);

		const { result } = renderHook(() => useWatchlistItem("movie", 550), {
			wrapper: Wrapper,
		});

		act(() => {
			result.current.toggle();
		});

		expect(mocks.navigate).toHaveBeenCalledWith({ to: "/sign-in" });
		expect(vi.mocked(addToWatchlist)).not.toHaveBeenCalled();
		expect(result.current.saved).toBe(false);
	});
});
