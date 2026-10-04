/**
 * @deprecated Import from `#/server/tmdb/client.ts` instead.
 * This shim keeps old imports working. The axios instance was removed
 * so `TMDB_READ_ACCESS_TOKEN` stays server-only behind `tmdbFetch`.
 */
export { ApiError, tmdbFetch, tmdbFetchValidated } from "../tmdb/client";
export type { TmdbRequestOptions } from "../tmdb/client";
