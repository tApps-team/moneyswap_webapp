import { Role } from "@/shared/types";

export type Comment = {
  id: number;
  comment_date: string;
  comment_time: string;
  text: string;
  role: Role;
  username?: string;
};
