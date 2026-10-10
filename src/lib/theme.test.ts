import { describe, expect, it } from "vitest";

import {
	THEME_INIT_SCRIPT,
	THEME_STORAGE_KEY,
	resolveTheme,
} from "#/lib/theme.ts";

describe("resolveTheme", () => {
	it("defaults to dark for missing or unexpected values", () => {
		expect(resolveTheme(null)).toBe("dark");
		expect(resolveTheme("")).toBe("dark");
		expect(resolveTheme("dark")).toBe("dark");
		expect(resolveTheme("system")).toBe("dark");
	});

	it("honours an explicit stored light value", () => {
		expect(resolveTheme("light")).toBe("light");
	});
});

describe("THEME_INIT_SCRIPT", () => {
	it("reads the same storage key and defaults to dark", () => {
		expect(THEME_INIT_SCRIPT).toContain(THEME_STORAGE_KEY);
		expect(THEME_INIT_SCRIPT).toContain('"dark"');
	});
});
