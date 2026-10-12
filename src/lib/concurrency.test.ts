import { setTimeout as sleep } from "node:timers/promises";

import { describe, expect, it } from "vitest";

import { mapWithConcurrency } from "#/lib/concurrency.ts";

const immediate = <T>(value: T): Promise<T> => Promise.resolve(value);

describe("mapWithConcurrency", () => {
	it("maps every item and preserves input order", async () => {
		const results = await mapWithConcurrency([3, 1, 4, 1, 5], 2, async (n) => {
			// Variable delays scramble completion order, so any correct output
			// ordering proves the results are placed by index, not by finish.
			await sleep(n);
			return n * 10;
		});

		expect(
			results.map((r) => (r.status === "fulfilled" ? r.value : null))
		).toEqual([30, 10, 40, 10, 50]);
	});

	it("never runs more than `limit` mappers at once", async () => {
		let inFlight = 0;
		let peak = 0;
		const items = Array.from({ length: 20 }, (_, index) => index);

		await mapWithConcurrency(items, 4, async (item) => {
			inFlight += 1;
			peak = Math.max(peak, inFlight);
			await sleep(2);
			inFlight -= 1;
			return item;
		});

		expect(peak).toBeLessThanOrEqual(4);
		// Guards against a regression that quietly serialises the work.
		expect(peak).toBeGreaterThan(1);
	});

	it("settles rejected items without failing the batch", async () => {
		const results = await mapWithConcurrency([1, 2, 3], 2, (n) =>
			n === 2 ? Promise.reject(new Error("boom")) : Promise.resolve(n)
		);

		expect(results.map((r) => r.status)).toEqual([
			"fulfilled",
			"rejected",
			"fulfilled",
		]);
	});

	it("returns an empty array for empty input", async () => {
		await expect(mapWithConcurrency([], 4, immediate)).resolves.toEqual([]);
	});

	it.each([0, -1, 1.5])("rejects an invalid limit of %s", async (limit) => {
		await expect(mapWithConcurrency([1], limit, immediate)).rejects.toThrow(
			RangeError
		);
	});
});
