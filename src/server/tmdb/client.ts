import { z } from "zod";

import { serverEnv } from "#/env/server.ts";

export const TMDB_DEFAULT_TIMEOUT_MS = 10_000;

interface TmdbErrorBody {
	success?: boolean;
	status_code?: number;
	status_message?: string;
}

const tmdbErrorBodySchema = z.object({
	status_code: z.number().optional(),
	status_message: z.string().optional(),
	success: z.boolean().optional(),
});

export class ApiError extends Error {
	readonly code?: number;
	readonly endpoint: string;
	readonly status: number;

	constructor(options: {
		endpoint: string;
		message: string;
		status: number;
		code?: number;
		cause?: unknown;
	}) {
		super(options.message, { cause: options.cause });
		this.name = "ApiError";
		this.endpoint = options.endpoint;
		this.status = options.status;
		this.code = options.code;
	}
}

export interface TmdbRequestOptions {
	params?: Record<string, string | number | boolean | undefined>;
	signal?: AbortSignal;
	timeoutMs?: number;
}

const buildUrl = (
	endpoint: string,
	params?: TmdbRequestOptions["params"]
): string => {
	const normalizedEndpoint = endpoint.startsWith("/")
		? endpoint
		: `/${endpoint}`;
	const url = new URL(`${serverEnv.TMDB_BASE_URL}${normalizedEndpoint}`);

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) {
				url.searchParams.set(key, String(value));
			}
		}
	}

	return url.toString();
};

const combineSignals = (
	userSignal: AbortSignal | undefined,
	timeoutMs: number
): AbortSignal => {
	const timeoutSignal = AbortSignal.timeout(timeoutMs);
	if (!userSignal) {
		return timeoutSignal;
	}
	return AbortSignal.any([userSignal, timeoutSignal]);
};

const parseErrorBody = async (response: Response): Promise<TmdbErrorBody> => {
	try {
		const data: unknown = await response.json();
		const parsed = tmdbErrorBodySchema.safeParse(data);
		return parsed.success ? parsed.data : {};
	} catch {
		return {};
	}
};

/**
 * Server-only TMDB GET helper.
 *
 * Must only be imported from server functions / server routes so
 * `TMDB_READ_ACCESS_TOKEN` never reaches the client bundle.
 */
export const tmdbFetch = async <T = unknown>(
	endpoint: string,
	options: TmdbRequestOptions = {}
): Promise<T> => {
	if (typeof window !== "undefined") {
		throw new TypeError(
			"tmdbFetch is server-only and must not run in the browser"
		);
	}

	const timeoutMs = options.timeoutMs ?? TMDB_DEFAULT_TIMEOUT_MS;
	const url = buildUrl(endpoint, options.params);

	let response: Response;
	try {
		response = await fetch(url, {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${serverEnv.TMDB_READ_ACCESS_TOKEN}`,
				"Content-Type": "application/json",
			},
			method: "GET",
			signal: combineSignals(options.signal, timeoutMs),
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error && error.name === "AbortError") {
			throw new ApiError({
				endpoint,
				message: `TMDB request to ${endpoint} timed out or was aborted`,
				status: 504,
			});
		}
		throw new ApiError({
			cause: error,
			endpoint,
			message:
				error instanceof Error
					? `TMDB request to ${endpoint} failed: ${error.message}`
					: `TMDB request to ${endpoint} failed`,
			status: 503,
		});
	}

	if (!response.ok) {
		const body = await parseErrorBody(response);
		throw new ApiError({
			code: body.status_code,
			endpoint,
			message:
				body.status_message ??
				`TMDB request to ${endpoint} failed with status ${response.status}`,
			status: response.status,
		});
	}

	try {
		const data: unknown = await response.json();
		// SAFETY: caller opts out of validation with the unchecked generic default;
		// use tmdbFetchValidated when the TMDB response shape must be verified.
		return data as T;
	} catch (error) {
		throw new ApiError({
			cause: error,
			endpoint,
			message: `Failed to parse TMDB response from ${endpoint}`,
			status: 502,
		});
	}
};

/**
 * Fetch + validate a TMDB response in one step.
 * Throws `ApiError` with status 502 when the shape is unexpected.
 */
export const tmdbFetchValidated = async <T>(
	endpoint: string,
	schema: z.ZodType<T>,
	options: TmdbRequestOptions = {}
): Promise<T> => {
	const data = await tmdbFetch<unknown>(endpoint, options);
	const parsed = schema.safeParse(data);
	if (!parsed.success) {
		throw new ApiError({
			cause: parsed.error,
			endpoint,
			message: `Unexpected TMDB response shape from ${endpoint}`,
			status: 502,
		});
	}
	return parsed.data;
};
