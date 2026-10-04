import { z } from "zod";

import {
	idSchema,
	idSchemaOptional,
	imagesSchema,
	reviewSchema,
	videoSchema,
} from "./common";

export const videoResultsSchema = z.object({
	id: idSchemaOptional,
	results: z.array(videoSchema),
});
export type VideoResults = z.infer<typeof videoResultsSchema>;

export const imageResultsSchema = imagesSchema.extend({
	id: idSchemaOptional,
});
export type ImageResults = z.infer<typeof imageResultsSchema>;

export const paginatedSchema = <T extends z.ZodType>(itemSchema: T) =>
	z.object({
		page: idSchema.positive(),
		results: z.array(itemSchema),
		total_pages: idSchema.nonnegative(),
		total_results: idSchema.nonnegative(),
	});

export const reviewsSchema = paginatedSchema(reviewSchema);
export type Reviews = z.infer<typeof reviewsSchema>;
