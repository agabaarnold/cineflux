import { defineRelations } from "drizzle-orm";

import { schema } from "./schema";

export const relations = defineRelations(schema, (r) => ({
	users: {
		sessions: r.many.sessions({
			from: r.users.id,
			to: r.sessions.userId,
		}),
		accounts: r.many.accounts({
			from: r.users.id,
			to: r.accounts.userId,
		}),
		watchlist: r.many.watchlist({
			from: r.users.id,
			to: r.watchlist.userId,
		}),
	},
	sessions: {
		user: r.one.users({
			from: r.sessions.userId,
			to: r.users.id,
		}),
	},
	accounts: {
		user: r.one.users({
			from: r.accounts.userId,
			to: r.users.id,
		}),
	},
	watchlist: {
		user: r.one.users({
			from: r.watchlist.userId,
			to: r.users.id,
		}),
	},
}));
