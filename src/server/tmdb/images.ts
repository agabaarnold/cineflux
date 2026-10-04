export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export type TmdbImageSize =
	| "w92"
	| "w154"
	| "w185"
	| "w300"
	| "w342"
	| "w500"
	| "w780"
	| "w1280"
	| "original";

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
	size: TmdbImageSize = "w500"
): string | null => getImageUrl(path, size);

export const getBackdropUrl = (
	path: string | null | undefined,
	size: TmdbImageSize = "w780"
): string | null => getImageUrl(path, size);
