import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import type { Theme } from "#/lib/theme.ts";
import { ThemeProvider, useTheme } from "#/hooks/use-theme.tsx";
import { THEME_STORAGE_KEY } from "#/lib/theme.ts";

const Wrapper = ({ children }: { children: ReactNode }) => (
	<ThemeProvider>{children}</ThemeProvider>
);

const storedTheme = (): string | null =>
	window.localStorage.getItem(THEME_STORAGE_KEY);

const isDarkApplied = (): boolean =>
	document.documentElement.classList.contains("dark");

beforeEach(() => {
	window.localStorage.clear();
	document.documentElement.classList.remove("dark");
	document.documentElement.style.colorScheme = "";
});

describe("ThemeProvider", () => {
	it("defaults to dark and applies it to the document", () => {
		const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

		expect(result.current.theme satisfies Theme).toBe("dark");
		expect(isDarkApplied()).toBe(true);
		expect(document.documentElement.style.colorScheme).toBe("dark");
	});

	it("restores a stored light theme on mount", () => {
		window.localStorage.setItem(THEME_STORAGE_KEY, "light");

		const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

		expect(result.current.theme).toBe("light");
		expect(isDarkApplied()).toBe(false);
	});

	it("toggles the theme and persists it", () => {
		const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

		act(() => {
			result.current.toggle();
		});

		expect(result.current.theme).toBe("light");
		expect(isDarkApplied()).toBe(false);
		expect(storedTheme()).toBe("light");

		act(() => {
			result.current.toggle();
		});

		expect(result.current.theme).toBe("dark");
		expect(isDarkApplied()).toBe(true);
		expect(storedTheme()).toBe("dark");
	});

	it("throws outside the provider", () => {
		expect(() => renderHook(() => useTheme())).toThrow(
			"useTheme must be used within ThemeProvider"
		);
	});
});
