import { z } from "zod";
export const addReviewSchema = z.object({
  review: z.string().min(1).max(2000),
  grade: z.enum(["positive", "neutral", "negative"], {
    required_error: "Поле обзятельно",
  }),
});
export type AddReviewSchemaType = z.infer<typeof addReviewSchema>;
