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
        <p className="text-[10px] uppercase text-mainColor font-medium">
          {comment?.role === Role.admin
            ? t("comments.comment_from_admin")
            : comment?.role === Role.exchanger
            ? t("comments.comment_from_exchanger")
            : t("comments.comment_from_user")}
        </p>
        <div className="grid grid-cols-[1fr_auto] justify-between items-center gap-2">
          <p className="truncate uppercase text-[12px] font-semibold text-white">
            {comment?.role === Role.admin
              ? t("comments.admin")
              : comment?.username || "Unknown"}
          </p>
          <p className="justify-self-end font-light uppercase text-xs text-mainColor">
            {formatDate(comment?.comment_date)} / {comment?.comment_time}
          </p>
        </div>
      </div>
      <div className="px-0 relative">
        <p className="text-white text-[12px] font-normal relative pl-3 break-words">
          {comment?.text}
          <span className="absolute left-0 top-[2px] w-[2px] rounded-md bg-[#555555] h-[calc(100%_-_4px)]"></span>
        </p>
      </div>
    </div>
  );
};
