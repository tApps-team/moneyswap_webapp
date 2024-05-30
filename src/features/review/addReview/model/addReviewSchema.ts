import { Grade } from "@/entities/review";
import { z } from "zod";
export const addReviewSchema = z
  .object({
    review: z.string().min(1).max(2000),
    grade: z.enum(["1", "0", "-1"], {
      required_error: "Поле обзятельно",
    }),
    transaction_id: z.string().optional(),
  })
  .refine((data) => data.grade !== "-1" || data.transaction_id, {
    message: "transaction_id is required for negative reviews",
    path: ["transaction_id"],
  });
export type AddReviewSchemaType = z.infer<typeof addReviewSchema>;
