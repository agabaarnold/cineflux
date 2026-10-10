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
	title: string;
}

export const pageHead = ({ description, image, title }: PageHeadOptions) => ({
	meta: [
		{ title },
		{ content: description, name: "description" },
		{ content: title, property: "og:title" },
		{ content: description, property: "og:description" },
		{ content: title, name: "twitter:title" },
		{ content: description, name: "twitter:description" },
		...(image
			? [
					{ content: "summary_large_image", name: "twitter:card" },
					{ content: image, property: "og:image" },
					{ content: image, name: "twitter:image" },
				]
			: []),
	],
});
