import { useEffect, useState } from "react";

import type {
	WatchProviderRegion,
	WatchProviders as WatchProvidersData,
} from "#/schemas/common.ts";
import { getLogoUrl } from "#/server/tmdb/images.ts";

const FALLBACK_REGION = "US";

const parseRegion = (locale: string | undefined): string => {
	if (!locale) {
		return FALLBACK_REGION;
	}
	const [, region] = locale.split(/[-_]/u);
	if (region && /^[A-Za-z]{2}$/u.test(region)) {
		return region.toUpperCase();
	}
	return FALLBACK_REGION;
};

const useUserRegion = (): string => {
	const [region, setRegion] = useState(FALLBACK_REGION);
	useEffect(() => {
		const onChange = () => {
			setRegion(parseRegion(navigator.language));
		};
		onChange();
		window.addEventListener("languagechange", onChange);
		return () => window.removeEventListener("languagechange", onChange);
	}, []);
	return region;
};

const providerGroups = [
	{ key: "flatrate", label: "Stream" },
	{ key: "rent", label: "Rent" },
	{ key: "buy", label: "Buy" },
	{ key: "free", label: "Free" },
	{ key: "ads", label: "Ads" },
] as const;

const hasProviders = (
	region: WatchProviderRegion | undefined
): region is WatchProviderRegion => {
	if (!region) {
		return false;
	}
	return providerGroups.some((group) => (region[group.key]?.length ?? 0) > 0);
};

interface PickedRegion {
	code: string;
	data: WatchProviderRegion;
}

const pickRegion = (
	results: Record<string, WatchProviderRegion>,
	preferred: string
): PickedRegion | null => {
	const preferredEntry = results[preferred];
	if (hasProviders(preferredEntry)) {
		return { code: preferred, data: preferredEntry };
	}
	if (preferred !== FALLBACK_REGION) {
		const fallbackEntry = results[FALLBACK_REGION];
		if (hasProviders(fallbackEntry)) {
			return { code: FALLBACK_REGION, data: fallbackEntry };
		}
	}
	for (const code of Object.keys(results)) {
		const entry = results[code];
		if (hasProviders(entry)) {
			return { code, data: entry };
		}
	}
	return null;
};

export const WatchProviders = ({
	providers,
}: {
	providers: WatchProvidersData;
}) => {
	const userRegion = useUserRegion();
	const picked = pickRegion(providers.results, userRegion);
	if (!picked) {
		return null;
	}
	const visibleGroups = providerGroups.filter(
		(group) => (picked.data[group.key]?.length ?? 0) > 0
	);

	return (
		<div className="mt-8">
			<h3 className="text-lg font-semibold">Where to watch</h3>
			<p className="text-muted-foreground mt-1 text-sm">
				Showing providers for {picked.code}
				{picked.data.link ? (
					<>
						{" · "}
						<a
							className="text-primary font-medium hover:underline"
							href={picked.data.link}
							rel="noopener noreferrer"
							target="_blank"
						>
							View all options
						</a>
					</>
				) : null}
			</p>
			<dl className="mt-3 grid gap-x-12 gap-y-3 md:grid-cols-2">
				{visibleGroups.map((group) => (
					<div className="flex gap-4" key={group.key}>
						<dt className="text-muted-foreground w-32 shrink-0 text-sm">
							{group.label}
						</dt>
						<dd className="flex flex-wrap gap-2">
							{(picked.data[group.key] ?? []).map((provider) => {
								const logo = getLogoUrl(provider.logo_path, "w92");
								return logo ? (
									<img
										alt={provider.provider_name}
										className="size-10 rounded-lg border object-cover"
										key={provider.provider_id}
										loading="lazy"
										src={logo}
										title={provider.provider_name}
									/>
								) : (
									<span
										className="bg-muted rounded-lg border px-2 py-1 text-xs"
										key={provider.provider_id}
									>
										{provider.provider_name}
									</span>
								);
							})}
						</dd>
					</div>
				))}
			</dl>
		</div>
	);
};
