import { defineRelations } from "drizzle-orm";

import { schema } from "./schema";

export const relations = defineRelations(schema, () => ({}));
