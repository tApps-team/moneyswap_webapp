import { Comment } from "../model/types/commentTypes";
import { formatDate } from "@/shared/lib";
import { Role } from "@/shared/types";
import { useTranslation } from "react-i18next";

type CommentCardProps = {
  comment: Comment;
};
export const CommentCard = (props: CommentCardProps) => {
  const { comment } = props;
  const { t } = useTranslation();
  return (
    <div className="grid gap-2 bg-transparent pt-3">
      <div className="grid gap-0.5">
        <p className="text-[10px] uppercase text-darkGray font-normal">
          {comment?.role === Role.admin
            ? t("comments.comment_from_admin")
            : comment?.role === Role.exchanger
            ? t("comments.comment_from_exchanger")
            : t("comments.comment_from_user")}
        </p>
        <div className="grid grid-cols-[1fr_auto] justify-between items-center gap-2">
          <p className="truncate uppercase text-[14px] font-medium">
            {comment?.role === Role.admin
              ? t("comments.admin")
              : comment?.name || "(exchanger)"}
          </p>
          <p className="justify-self-end font-normal uppercase text-[14px]">
            {formatDate(comment?.comment_date)} / {comment?.comment_time}
          </p>
        </div>
      </div>
      <div className="px-0 relative">
        <p className="text-darkGray text-[12px] font-normal relative pl-3 break-words">
          {comment?.text}
          <span className="absolute left-0 top-[2px] w-[4px] rounded-md bg-darkGray h-[calc(100%_-_4px)]"></span>
        </p>
      </div>
    </div>
  );
};
