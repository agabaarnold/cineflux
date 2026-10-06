import { queryOptions } from "@tanstack/react-query";

export const STALE_TIME = {
	default: 5 * 60 * 1000,
	volatile: 0,
	lists: 6 * 60 * 60 * 1000,
	slow: 24 * 60 * 60 * 1000,
	static: 7 * 24 * 60 * 60 * 1000,
} as const;
export type CacheTier = keyof typeof STALE_TIME;

export const GC_TIME: Record<CacheTier, number> = {
	default: 30 * 60 * 1000,
	volatile: 5 * 60 * 1000,
	lists: STALE_TIME.lists * 2,
	slow: STALE_TIME.slow * 2,
	static: STALE_TIME.static * 2,
};

export type KeyInputValue =
	| string
	| number
	| boolean
	| readonly string[]
	| undefined;
export type KeyInput = Record<string, KeyInputValue>;

const SCOPE = "tmdb";
const SUB = {
	aggregateCredits: "aggregate-credits",
	airingToday: "airing-today",
	alternativeNames: "alternative-names",
	alternativeTitles: "alternative-titles",
	changes: "changes",
	collection: "collection",
	collections: "collections",
	combinedCredits: "combined-credits",
	companies: "companies",
	company: "company",
	configuration: "configuration",
	contentRatings: "content-ratings",
	credits: "credits",
	details: "details",
	episode: "episode",
	episodeGroup: "episode-group",
	episodeGroups: "episode-groups",
	externalIds: "external-ids",
	images: "images",
	keyword: "keyword",
	keywords: "keywords",
	latest: "latest",
	lists: "lists",
	movieCredits: "movie-credits",
	movieGenres: "movie-genres",
	movies: "movies",
	multi: "multi",
	network: "network",
	nowPlaying: "now-playing",
	onTheAir: "on-the-air",
	people: "people",
	popular: "popular",
	query: "query",
	recommendations: "recommendations",
	releaseDates: "release-dates",
	reviews: "reviews",
	screenedTheatrically: "screened-theatrically",
	season: "season",
	similar: "similar",
	taggedImages: "tagged-images",
	topRated: "top-rated",
	translations: "translations",
	tv: "tv",
	tvCredits: "tv-credits",
	tvGenres: "tv-genres",
	upcoming: "upcoming",
	videos: "videos",
	watchProviders: "watch-providers",
} as const;
const DOMAIN = {
	catalog: "catalog",
	discover: "discover",
	movie: "movie",
	person: "person",
	search: "search",
	trending: "trending",
	tv: "tv",
} as const;

const clean = (input: KeyInput): KeyInput =>
	Object.fromEntries(
		Object.entries(input).filter(([, value]) => value !== undefined)
	);

export const tmdbKeys = {
	trending: {
		query: (input: KeyInput) =>
			[SCOPE, DOMAIN.trending, SUB.query, clean(input)] as const,
	},
	movie: {
		details: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.details, clean(input)] as const,
		alternativeTitles: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.alternativeTitles, clean(input)] as const,
		changes: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.changes, clean(input)] as const,
		credits: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.credits, clean(input)] as const,
		externalIds: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.externalIds, clean(input)] as const,
		images: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.images, clean(input)] as const,
		keywords: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.keywords, clean(input)] as const,
		lists: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.lists, clean(input)] as const,
		recommendations: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.recommendations, clean(input)] as const,
		releaseDates: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.releaseDates, clean(input)] as const,
		reviews: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.reviews, clean(input)] as const,
		similar: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.similar, clean(input)] as const,
		translations: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.translations, clean(input)] as const,
		videos: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.videos, clean(input)] as const,
		watchProviders: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.watchProviders, clean(input)] as const,
		latest: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.latest, clean(input)] as const,
		nowPlaying: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.nowPlaying, clean(input)] as const,
		popular: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.popular, clean(input)] as const,
		topRated: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.topRated, clean(input)] as const,
		upcoming: (input: KeyInput) =>
			[SCOPE, DOMAIN.movie, SUB.upcoming, clean(input)] as const,
	},
	tv: {
		details: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.details, clean(input)] as const,
		aggregateCredits: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.aggregateCredits, clean(input)] as const,
		alternativeTitles: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.alternativeTitles, clean(input)] as const,
		changes: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.changes, clean(input)] as const,
		contentRatings: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.contentRatings, clean(input)] as const,
		credits: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.credits, clean(input)] as const,
		episodeGroups: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.episodeGroups, clean(input)] as const,
		episodeGroupDetails: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.episodeGroup, clean(input)] as const,
		externalIds: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.externalIds, clean(input)] as const,
		images: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.images, clean(input)] as const,
		keywords: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.keywords, clean(input)] as const,
		lists: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.lists, clean(input)] as const,
		recommendations: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.recommendations, clean(input)] as const,
		reviews: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.reviews, clean(input)] as const,
		screenedTheatrically: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.screenedTheatrically, clean(input)] as const,
		similar: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.similar, clean(input)] as const,
		translations: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.translations, clean(input)] as const,
		videos: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.videos, clean(input)] as const,
		watchProviders: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.watchProviders, clean(input)] as const,
		seasonDetails: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.season, clean(input)] as const,
		seasonCredits: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.season, SUB.credits, clean(input)] as const,
		seasonExternalIds: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.season, SUB.externalIds, clean(input)] as const,
		seasonImages: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.season, SUB.images, clean(input)] as const,
		seasonTranslations: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.season, SUB.translations, clean(input)] as const,
		seasonVideos: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.season, SUB.videos, clean(input)] as const,
		episodeDetails: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.episode, clean(input)] as const,
		episodeCredits: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.episode, SUB.credits, clean(input)] as const,
		episodeExternalIds: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.episode, SUB.externalIds, clean(input)] as const,
		episodeImages: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.episode, SUB.images, clean(input)] as const,
		episodeTranslations: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.episode, SUB.translations, clean(input)] as const,
		episodeVideos: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.episode, SUB.videos, clean(input)] as const,
		airingToday: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.airingToday, clean(input)] as const,
		onTheAir: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.onTheAir, clean(input)] as const,
		popular: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.popular, clean(input)] as const,
		topRated: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.topRated, clean(input)] as const,
		latest: (input: KeyInput) =>
			[SCOPE, DOMAIN.tv, SUB.latest, clean(input)] as const,
	},
	person: {
		details: (input: KeyInput) =>
			[SCOPE, DOMAIN.person, SUB.details, clean(input)] as const,
		combinedCredits: (input: KeyInput) =>
			[SCOPE, DOMAIN.person, SUB.combinedCredits, clean(input)] as const,
		movieCredits: (input: KeyInput) =>
			[SCOPE, DOMAIN.person, SUB.movieCredits, clean(input)] as const,
		tvCredits: (input: KeyInput) =>
			[SCOPE, DOMAIN.person, SUB.tvCredits, clean(input)] as const,
		externalIds: (input: KeyInput) =>
			[SCOPE, DOMAIN.person, SUB.externalIds, clean(input)] as const,
		images: (input: KeyInput) =>
			[SCOPE, DOMAIN.person, SUB.images, clean(input)] as const,
		taggedImages: (input: KeyInput) =>
			[SCOPE, DOMAIN.person, SUB.taggedImages, clean(input)] as const,
		translations: (input: KeyInput) =>
			[SCOPE, DOMAIN.person, SUB.translations, clean(input)] as const,
		latest: (input: KeyInput) =>
			[SCOPE, DOMAIN.person, SUB.latest, clean(input)] as const,
		popular: (input: KeyInput) =>
			[SCOPE, DOMAIN.person, SUB.popular, clean(input)] as const,
	},
	search: {
		movies: (input: KeyInput) =>
			[SCOPE, DOMAIN.search, SUB.movies, clean(input)] as const,
		tv: (input: KeyInput) =>
			[SCOPE, DOMAIN.search, SUB.tv, clean(input)] as const,
		people: (input: KeyInput) =>
			[SCOPE, DOMAIN.search, SUB.people, clean(input)] as const,
		multi: (input: KeyInput) =>
			[SCOPE, DOMAIN.search, SUB.multi, clean(input)] as const,
		collections: (input: KeyInput) =>
			[SCOPE, DOMAIN.search, SUB.collections, clean(input)] as const,
		companies: (input: KeyInput) =>
			[SCOPE, DOMAIN.search, SUB.companies, clean(input)] as const,
		keywords: (input: KeyInput) =>
			[SCOPE, DOMAIN.search, SUB.keywords, clean(input)] as const,
	},
	discover: {
		movies: (input: KeyInput) =>
			[SCOPE, DOMAIN.discover, SUB.movies, clean(input)] as const,
		tv: (input: KeyInput) =>
			[SCOPE, DOMAIN.discover, SUB.tv, clean(input)] as const,
	},
	catalog: {
		movieGenres: (input: KeyInput) =>
			[SCOPE, DOMAIN.catalog, SUB.movieGenres, clean(input)] as const,
		tvGenres: (input: KeyInput) =>
			[SCOPE, DOMAIN.catalog, SUB.tvGenres, clean(input)] as const,
		configuration: (input: KeyInput) =>
			[SCOPE, DOMAIN.catalog, SUB.configuration, clean(input)] as const,
		collectionDetails: (input: KeyInput) =>
			[SCOPE, DOMAIN.catalog, SUB.collection, clean(input)] as const,
		collectionImages: (input: KeyInput) =>
			[
				SCOPE,
				DOMAIN.catalog,
				SUB.collection,
				SUB.images,
				clean(input),
			] as const,
		collectionTranslations: (input: KeyInput) =>
			[
				SCOPE,
				DOMAIN.catalog,
				SUB.collection,
				SUB.translations,
				clean(input),
			] as const,
		companyDetails: (input: KeyInput) =>
			[SCOPE, DOMAIN.catalog, SUB.company, clean(input)] as const,
		companyAlternativeNames: (input: KeyInput) =>
			[
				SCOPE,
				DOMAIN.catalog,
				SUB.company,
				SUB.alternativeNames,
				clean(input),
			] as const,
		companyImages: (input: KeyInput) =>
			[SCOPE, DOMAIN.catalog, SUB.company, SUB.images, clean(input)] as const,
		networkDetails: (input: KeyInput) =>
			[SCOPE, DOMAIN.catalog, SUB.network, clean(input)] as const,
		networkAlternativeNames: (input: KeyInput) =>
			[
				SCOPE,
				DOMAIN.catalog,
				SUB.network,
				SUB.alternativeNames,
				clean(input),
			] as const,
		keywordDetails: (input: KeyInput) =>
			[SCOPE, DOMAIN.catalog, SUB.keyword, clean(input)] as const,
		keywordMovies: (input: KeyInput) =>
			[SCOPE, DOMAIN.catalog, SUB.keyword, SUB.movies, clean(input)] as const,
	},
} as const;

export const tmdbQueryOptions = <T>(
	queryKey: readonly unknown[],
	tier: CacheTier,
	queryFn: () => Promise<T>
) =>
	queryOptions({
		gcTime: GC_TIME[tier],
		queryFn,
		queryKey,
		staleTime: STALE_TIME[tier],
	});
