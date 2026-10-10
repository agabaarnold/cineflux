import { clientEnv } from "#/env/client.ts";

const RAW_SITE_URL = clientEnv.VITE_SITE_URL;

export const siteUrl = RAW_SITE_URL?.endsWith("/")
	? RAW_SITE_URL.slice(0, -1)
	: RAW_SITE_URL;

export const canonicalUrl = (path: string): string | null =>
	siteUrl ? `${siteUrl}${path}` : null;

const SITE_NAME = "CineFlux";
const MAX_DESCRIPTION_LENGTH = 160;

export const pageTitle = (name: string): string => `${name} | ${SITE_NAME}`;

export const truncateDescription = (
	value: string | null | undefined,
	fallback: string
): string => {
	const text = value?.trim() || fallback;
	if (text.length <= MAX_DESCRIPTION_LENGTH) {
		return text;
	}
	return `${text.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd()}…`;
};

interface PageHeadOptions {
	description: string;
	image?: string | null;
	path?: string;
	title: string;
}

export const pageHead = ({
	description,
	image,
	path,
	title,
}: PageHeadOptions) => {
	const canonical = path ? canonicalUrl(path) : null;
	return {
		links: canonical ? [{ href: canonical, rel: "canonical" }] : [],
		meta: [
			{ title },
			{ content: description, name: "description" },
			{ content: title, property: "og:title" },
			{ content: description, property: "og:description" },
			{ content: title, name: "twitter:title" },
			{ content: description, name: "twitter:description" },
			...(canonical ? [{ content: canonical, property: "og:url" }] : []),
			...(image
				? [
						{ content: "summary_large_image", name: "twitter:card" },
						{ content: image, property: "og:image" },
						{ content: image, name: "twitter:image" },
					]
				: []),
		],
	};
};
