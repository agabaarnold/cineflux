export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export type BackdropSize = "w300" | "w780" | "w1280" | "original";

export type LogoSize =
	| "w45"
	| "w92"
	| "w154"
	| "w185"
	| "w300"
	| "w500"
	| "original";

export type PosterSize =
	| "w92"
	| "w154"
	| "w185"
	| "w342"
	| "w500"
	| "w780"
	| "original";

export type ProfileSize = "w45" | "w185" | "h632" | "original";

export type StillSize = "w92" | "w185" | "w300" | "original";

export type TmdbImageSize =
	| BackdropSize
	| LogoSize
	| PosterSize
	| ProfileSize
	| StillSize;

/**
 * Build a full TMDB image URL. Returns `null` when there is no path
 * so callers can render a placeholder instead of a broken image.
 */
export const getImageUrl = (
	path: string | null | undefined,
	size: TmdbImageSize = "w500"
): string | null => {
	if (!path) {
		return null;
	}
	return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (
	path: string | null | undefined,
	size: PosterSize = "w500"
): string | null => getImageUrl(path, size);

export const getBackdropUrl = (
	path: string | null | undefined,
	size: BackdropSize = "w780"
): string | null => getImageUrl(path, size);

export const getProfileUrl = (
	path: string | null | undefined,
	size: ProfileSize = "w185"
): string | null => getImageUrl(path, size);

export const getLogoUrl = (
	path: string | null | undefined,
	size: LogoSize = "w185"
): string | null => getImageUrl(path, size);
