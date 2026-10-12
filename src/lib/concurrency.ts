/**
 * Map `items` through `mapper` with at most `limit` promises in flight,
 * returning a settled result per input in the original order.
 *
 * A shared iterator is consumed by every worker. Because JavaScript is
 * single-threaded, each worker pulls the next index synchronously the moment
 * it resumes from `await`, so no item is skipped or processed twice.
 */
export const mapWithConcurrency = async <T, R>(
	items: readonly T[],
	limit: number,
	mapper: (item: T, index: number) => Promise<R>
): Promise<PromiseSettledResult<R>[]> => {
	if (!Number.isInteger(limit) || limit < 1) {
		throw new RangeError(
			"mapWithConcurrency requires an integer limit of at least 1"
		);
	}

	const results: PromiseSettledResult<R>[] = [];
	const source = items.values();
	let index = 0;

	const worker = async (): Promise<void> => {
		for (const item of source) {
			const position = index;
			index += 1;
			try {
				// SAFETY: this await is the throttle. Each worker holds exactly one
				// item, so at most `limit` mappers run at once. Collecting the
				// promises and using Promise.all, as the rule suggests, would run
				// every mapper immediately and delete the cap this function exists
				// to enforce.
				// oxlint-disable-next-line no-await-in-loop
				const value = await mapper(item, position);
				results[position] = { status: "fulfilled", value };
			} catch (error) {
				results[position] = { reason: error, status: "rejected" };
			}
		}
	};

	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, () => worker())
	);

	return results;
};
