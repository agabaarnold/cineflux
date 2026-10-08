import { accounts, sessions, users, verifications } from "./auth.schema";
import { watchlist } from "./watchlist.schema";

export { watchlist } from "./watchlist.schema";

export const schema = {
	users,
	sessions,
	accounts,
	verifications,
	watchlist,
} as const;
