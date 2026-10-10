import { describe, expect, it } from "vitest";

import type { RowItem } from "#/components/media/media-row.tsx";
import { sortItems } from "#/lib/watchlist-sort.ts";

const item = (overrides: Partial<RowItem>): RowItem => ({
	href: "/movie/1",
	id: "movie-1",
	image: null,
	mediaId: 1,
	mediaType: "movie",
	overview: "",
	stat: { kind: "rating", value: 7.5 },
	title: "Title",
	year: "2000",
	...overrides,
});

describe("sortItems", () => {
	it("keeps server order for recent", () => {
		const items = [item({ id: "a" }), item({ id: "b" })];
		expect(sortItems(items, "recent")).toEqual(items);
	});

	it("sorts titles A to Z without mutating the input", () => {
		const items = [item({ title: "Zulu" }), item({ title: "Alpha" })];
		expect(sortItems(items, "title").map((entry) => entry.title)).toEqual([
			"Alpha",
			"Zulu",
		]);
		expect(items[0]?.title).toBe("Zulu");
	});

	it("sorts ratings highest first", () => {
		const items = [
			item({ stat: { kind: "rating", value: 5 } }),
			item({ stat: { kind: "rating", value: 9 } }),
		];
		const [first] = sortItems(items, "rating");
		expect(first?.stat).toMatchObject({ value: 9 });
	});

	it("sorts years newest first with unknowns last", () => {
		const items = [
			item({ year: "" }),
			item({ year: "1999" }),
			item({ year: "2024" }),
		];
		expect(sortItems(items, "year").map((entry) => entry.year)).toEqual([
			"2024",
			"1999",
			"",
		]);
	});

	it("returns an empty list untouched", () => {
		expect(sortItems([], "title")).toEqual([]);
	});
});
