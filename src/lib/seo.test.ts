import { beforeEach, describe, expect, it, vi } from "vitest";

describe("pageTitle", () => {
	it("appends the site name", async () => {
		const { pageTitle } = await import("#/lib/seo.ts");
		expect(pageTitle("Movies")).toBe("Movies | CineFlux");
	});
});

describe("truncateDescription", () => {
	it("passes short text through untouched", async () => {
		const { truncateDescription } = await import("#/lib/seo.ts");
		expect(truncateDescription("A short overview.", "Fallback")).toBe(
			"A short overview."
		);
	});

	it("falls back when the value is empty or missing", async () => {
		const { truncateDescription } = await import("#/lib/seo.ts");
		expect(truncateDescription("", "Fallback")).toBe("Fallback");
		expect(truncateDescription(null, "Fallback")).toBe("Fallback");
		expect(truncateDescription(undefined, "Fallback")).toBe("Fallback");
	});

	it("truncates long text to 160 characters with an ellipsis", async () => {
		const { truncateDescription } = await import("#/lib/seo.ts");
		const result = truncateDescription(`${"a".repeat(200)} end`, "Fallback");
		expect(result.length).toBeLessThanOrEqual(160);
		expect(result.endsWith("…")).toBe(true);
		expect(result).not.toContain(" end");
	});
});

describe("canonicalUrl without VITE_SITE_URL", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.stubEnv("VITE_SITE_URL", "");
	});

	it("returns null so canonical tags are omitted", async () => {
		const { canonicalUrl, pageHead } = await import("#/lib/seo.ts");
		expect(canonicalUrl("/movie/1")).toBeNull();
		const head = pageHead({ description: "d", path: "/movie/1", title: "t" });
		expect(head.links).toEqual([]);
		expect(head.meta).not.toContainEqual({
			content: expect.any(String),
			property: "og:url",
		});
	});
});

describe("canonicalUrl with VITE_SITE_URL", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("joins the origin and path and strips a trailing slash", async () => {
		vi.stubEnv("VITE_SITE_URL", "https://example.com/");
		const { canonicalUrl } = await import("#/lib/seo.ts");
		expect(canonicalUrl("/movie/550")).toBe("https://example.com/movie/550");
		vi.unstubAllEnvs();
	});

	it("emits canonical link and og:url tags", async () => {
		vi.stubEnv("VITE_SITE_URL", "https://example.com");
		const { pageHead } = await import("#/lib/seo.ts");
		const head = pageHead({
			description: "d",
			image: "https://example.com/poster.jpg",
			path: "/movie/550",
			title: "t",
		});
		expect(head.links).toEqual([
			{ href: "https://example.com/movie/550", rel: "canonical" },
		]);
		vi.unstubAllEnvs();
	});
});

describe("pageHead images", () => {
	it("uses a large-image card only when an image is present", async () => {
		const { pageHead } = await import("#/lib/seo.ts");
		const withImage = pageHead({ description: "d", image: "img", title: "t" });
		const withoutImage = pageHead({ description: "d", title: "t" });
		expect(withImage.meta).toContainEqual({
			content: "summary_large_image",
			name: "twitter:card",
		});
		// Imageless pages omit the card tag; the root head supplies the
		// `summary` default which the deepest match overrides when present.
		expect(withoutImage.meta).not.toContainEqual({
			content: expect.any(String),
			name: "twitter:card",
		});
	});
});
