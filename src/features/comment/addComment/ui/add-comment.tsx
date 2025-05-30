import { FC, useState } from "react";
import { Loader, MessageCircleCode, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAddCommentMutation, useCheckUserCommentPermissionMutation } from "@/entities/comment";
import { ExchangerMarker, Grade } from "@/shared/types";
import { Dialog, DialogContent, DialogTitle, Textarea, useToast } from "@/shared/ui";
import { useAppSelector } from "@/shared/hooks";

type AddCommentProps = {
  exchanger_marker: ExchangerMarker;
  review_id: number;
  grade: Grade;
  seeAllReviews?: () => void;
}

export const AddComment:FC<AddCommentProps> = ({
  exchanger_marker,
  review_id,
  grade,
  seeAllReviews,
}) => {
  const { toast } = useToast();
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, user_id } = useAppSelector((state) => state.user);

  const [checkUserCommentPermission, { isLoading: isPermissionLoading, isError: isPermissionError }] = useCheckUserCommentPermissionMutation();

  const checkUserCommentPermissionHandler = () => {
    checkUserCommentPermission({
      exchange_marker: exchanger_marker,
      review_id: review_id,
      tg_id: user ? user?.id : user_id || 0,
    }).unwrap().then(() => {
      setIsOpen(true);
    }).catch((error) => {
      if (error?.status === 423) {
        toast({
          title: t("reviews.comment_permission_error_423"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("reviews.comment_permission_error"),
          variant: "destructive",
        });
      }
    });
  }

  const [answer, setAnswer] = useState<string>("");

  const [addComment, { isLoading: isAddCommentLoading }] = useAddCommentMutation();

  const sendAnswer = () => {
    if (answer.length < 2) {
      toast({
        title: t("reviews.comment_empty"),
        variant: "destructive",
      });
      return;
    }
    const answerReq = {
      exchange_marker: exchanger_marker,
      review_id: review_id,
      tg_id: user ? user?.id : user_id || 0,
      text: answer,
      grade: grade,
    }
    addComment(answerReq).unwrap().then(() => {
      setAnswer("");
      setIsOpen(false);
      toast({
        title: t("reviews.comment_success"),
        variant: "success",
      });
      seeAllReviews && seeAllReviews();
    }).catch((error) => {
      if (error?.status === 423) {
        toast({
          title: t("reviews.comment_permission_error_423"),
          variant: "destructive",
        });
      } else if (error?.status === 404) {
        toast({
          title: t("reviews.comment_error_404"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("reviews.comment_error"),
          variant: "destructive",
        });
      }
    });
  }

  return (
    <>
      {isPermissionLoading ? (
        <div className="mb-1 w-full flex items-center justify-end pr-4 gap-2 text-mainColor font-semibold uppercase text-[10px]">
          <Loader className="animate-spin size-4 text-mainColor" />
        </div>
      ) : (
        <button 
          className={`mb-1 w-full flex items-center justify-end pr-4 gap-2 text-mainColor font-semibold uppercase text-[10px] truncate ${isPermissionError ? "opacity-50 cursor-not-allowed" : ""}`} 
          disabled={isPermissionError} 
          onClick={checkUserCommentPermissionHandler}
        >
          {t("reviews.answer")}
          <Send className="size-4 stroke-[2px]" />
        </button>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md w-[90%] border-none rounded-[10px] px-4 py-8 pt-10 bg-new-dark-grey flex flex-col">
          <div className="grid grid-rows-[auto_1fr_auto] w-full h-full gap-10">
            <DialogTitle className="min-w-0 flex items-center justify-center gap-2 text-mainColor mobile:text-lg text-base font-semibold uppercase text-center">
              <MessageCircleCode className="mobile:size-8 size-6" />
              <span className="truncate">{t("reviews.add_comment_title")}</span>
            </DialogTitle>
            <Textarea
              className="h-full border-none rounded-[10px] bg-new-light-grey min-h-[200px] text-white placeholder:text-lightGray placeholder:font-light focus:placeholder:opacity-0 text-base resize-none"
              placeholder={t("reviews.comment_placeholder")}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              maxLength={2000}
            />
            <button className="bg-mainColor text-black rounded-[10px] py-3 font-medium" onClick={sendAnswer}>
              {isAddCommentLoading ? (
                <Loader className="animate-spin size-6 text-black mx-auto" />
              ) : (
                t("reviews.send")
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
