export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "cineflux:theme";

/** Anything other than an explicit stored "light" resolves to dark. */
export const resolveTheme = (stored: string | null): Theme =>
	stored === "light" ? "light" : "dark";

/**
 * Pre-paint bootstrap rendered via the root route's head scripts. Applies
 * the stored theme (default dark) before first render so there is no
 * light-mode flash. Re-execution is idempotent.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var m=t==="light"?"light":"dark";document.documentElement.classList.toggle("dark",m==="dark");document.documentElement.style.colorScheme=m;}catch(e){document.documentElement.classList.add("dark");}`;
