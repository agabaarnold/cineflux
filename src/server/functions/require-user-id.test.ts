// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import { requireUserId } from "#/server/require-user.ts";

const mocks = vi.hoisted(() => ({
	getSession: vi.fn(),
}));

// Module mocks isolate the auth check: the session comes from a stub so no
// auth flow is needed, and headers are irrelevant to the check.
// oxlint-disable-next-line anti-slop/no-module-mocking
vi.mock("#/lib/auth.ts", () => ({
	auth: { api: { getSession: mocks.getSession } },
}));

// Same isolation rationale as above.
// oxlint-disable-next-line anti-slop/no-module-mocking
vi.mock("@tanstack/react-start/server", () => ({
	getRequestHeaders: () => new Headers(),
}));

describe("requireUserId", () => {
	it("returns the session user id", async () => {
		mocks.getSession.mockResolvedValue({ user: { id: "user-1" } });

		await expect(requireUserId()).resolves.toBe("user-1");
	});

	it("throws for anonymous callers", async () => {
		mocks.getSession.mockResolvedValue(null);

		await expect(requireUserId()).rejects.toThrow("Unauthorized");
	});
});
