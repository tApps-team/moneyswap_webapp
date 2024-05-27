import { z } from "zod";
export const addReviewSchema = z.object({
  review: z.string().min(1).max(2000),
});
export type AddReviewSchemaType = z.infer<typeof addReviewSchema>;
