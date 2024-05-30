import { Grade } from "@/entities/review";
import { z } from "zod";
export const addReviewSchema = z.object({
  review: z.string().min(1).max(2000),
  grade: z.enum(["1", "0", "-1"], {
    required_error: "Поле обзятельно",
  }),
  transaction_id: z.string(),
});
export type AddReviewSchemaType = z.infer<typeof addReviewSchema>;
