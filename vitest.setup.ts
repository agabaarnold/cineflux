// Test-only fallbacks for server env vars that are validated at import time.
// Real values come from the environment; these fill gaps so suites that
// import server modules can run without a full local setup. Fallbacks are
// never used at runtime by tests (no TMDB calls, no real signing, and the
// database pool connects lazily only on query). Secrets are generated per
// process so no static credential material is committed.
const FALLBACK_ENV = {
	BETTER_AUTH_SECRET: crypto.randomUUID(),
	BETTER_AUTH_URL: "http://localhost:3000",
	DATABASE_URL: "postgresql://localhost:5432/cineflux_test",
	TMDB_API_KEY: "test",
	TMDB_BASE_URL: "https://api.themoviedb.org/3",
	TMDB_READ_ACCESS_TOKEN: "test",
};

for (const [key, fallback] of Object.entries(FALLBACK_ENV)) {
	if (!process.env[key]) {
		process.env[key] = fallback;
	}
}
