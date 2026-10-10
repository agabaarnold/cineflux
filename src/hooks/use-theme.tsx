import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { Theme } from "#/lib/theme.ts";
import { THEME_STORAGE_KEY, resolveTheme } from "#/lib/theme.ts";

const applyTheme = (theme: Theme): void => {
	document.documentElement.classList.toggle("dark", theme === "dark");
	document.documentElement.style.colorScheme = theme;
};

const readStoredTheme = (): Theme => {
	try {
		return resolveTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
	} catch {
		// Private-mode storage access throws; fall back to the default.
		return "dark";
	}
};

interface ThemeContextValue {
	theme: Theme;
	toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(() =>
		typeof window === "undefined" ? "dark" : readStoredTheme()
	);

	useEffect(() => {
		applyTheme(theme);
		try {
			window.localStorage.setItem(THEME_STORAGE_KEY, theme);
		} catch {
			// Private-mode storage access throws; the theme still applies.
		}
	}, [theme]);

	const toggle = useCallback(() => {
		setTheme((current) => (current === "dark" ? "light" : "dark"));
	}, []);

	const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = (): ThemeContextValue => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
};
