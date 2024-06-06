import { Card, CardContent, CardHeader } from "@/shared/ui";
import { Comment } from "../model/types/commentTypes";
import { formatDate } from "@/shared/lib";
import { Role } from "@/shared/types";

type CommentCardProps = {
  comment: Comment;
};
export const CommentCard = (props: CommentCardProps) => {
  const { comment } = props;
  return (
    <Card className="border-none ">
      <CardHeader>
        <p>
          {comment?.role === Role.admin
            ? "Ответ от администрации"
            : "Ответ от пользователя"}
        </p>
        <div className="flex justify-between">
          <p>{comment?.role === Role.admin ? "MONEYSWAP" : comment?.name}</p>
          <p>
            {formatDate(comment?.comment_date)} / {comment?.comment_time}
          </p>
        </div>
      </CardHeader>
      <CardContent>{comment?.text}</CardContent>
    </Card>
  );
};
