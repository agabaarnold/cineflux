import type { RowItem } from "#/components/media/media-row.tsx";

export type WatchlistSortKey = "recent" | "rating" | "title" | "year";

export const sortItems = (
	items: RowItem[],
	sort: WatchlistSortKey
): RowItem[] => {
	if (sort === "rating") {
		// SAFETY: spread creates a fresh copy, so in-place sort cannot mutate cached query data.
		// oxlint-disable-next-line unicorn/no-array-sort
		return [...items].sort((a, b) => (b.stat?.value ?? 0) - (a.stat?.value ?? 0));
	}
	if (sort === "title") {
		// SAFETY: spread creates a fresh copy, so in-place sort cannot mutate cached query data.
		// oxlint-disable-next-line unicorn/no-array-sort
		return [...items].sort((a, b) => a.title.localeCompare(b.title));
	}
	if (sort === "year") {
		// SAFETY: spread creates a fresh copy, so in-place sort cannot mutate cached query data.
		// oxlint-disable-next-line unicorn/no-array-sort
		return [...items].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
	}
	return items;
};
