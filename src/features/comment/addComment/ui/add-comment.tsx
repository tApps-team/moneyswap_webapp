import { FC, useEffect, useState } from "react";
import { Loader, MessageCircleCode, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ExchangerMarker } from "@/shared/types";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, Textarea, useToast } from "@/shared/ui";

type AddCommentProps = {
  exchanger_id: number;
  exchanger_marker: ExchangerMarker;
  review_id: number
}

export const AddComment:FC<AddCommentProps> = ({
  exchanger_id,
  exchanger_marker,
  review_id,
}) => {
  const { toast } = useToast();
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // permission request mock
  const permissionRequestMock = {
    isPermissionLoading: false,
    isPermissionFetching: false,
    isPermissionError: false,
    errorPermission: {
      status: 423,
      message: "Error",
    }
  }

  useEffect(() => {
    if (permissionRequestMock.isPermissionError) {
      if (permissionRequestMock.errorPermission.status === 423) {
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
    }
  }, [permissionRequestMock.isPermissionError]);

  const [answer, setAnswer] = useState<string>("");

  // add_comment request mock
  const addCommentRequestMock = {
    isAddCommentLoading: false,
    isAddCommentFetching: false,
  }

  const sendAnswer = () => {
    if (answer.length < 2) {
      toast({
        title: t("reviews.comment_empty"),
        variant: "destructive",
      });
      return;
    }
    const answerReq = {
      answer: answer,
      review_id: review_id,
      exchanger_id: exchanger_id,
      exchanger_marker: exchanger_marker,
    }
    // add_comment request + error 423 or any other error
    console.log(answerReq);
    setIsOpen(false);
    setAnswer("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {permissionRequestMock.isPermissionLoading || permissionRequestMock.isPermissionFetching ? (
        <div className="mb-1 w-full flex items-center justify-end pr-4 gap-2 text-mainColor font-semibold uppercase text-[10px]">
          <Loader className="animate-spin size-4 text-mainColor" />
        </div>
      ) : (
        <DialogTrigger className={`mb-1 w-full flex items-center justify-end pr-4 gap-2 text-mainColor font-semibold uppercase text-[10px] truncate ${permissionRequestMock.isPermissionError ? "opacity-50 cursor-not-allowed" : ""}`} disabled={permissionRequestMock.isPermissionError}>
          {t("reviews.answer")}
          <Send className="size-4 stroke-[2px]" />
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md w-[90%] border-none rounded-[10px] px-4 py-8 pt-10 bg-new-dark-grey flex flex-col">
        <div className="grid grid-rows-[auto_1fr_auto] w-full h-full gap-10">
          <DialogTitle className="min-w-0 flex items-center justify-center gap-2 text-mainColor mobile:text-lg text-base font-semibold uppercase text-center"><MessageCircleCode className="mobile:size-8 size-6" /><span className="truncate">{t("reviews.add_comment_title")}</span></DialogTitle>
          <Textarea
            className="h-full border-none rounded-[10px] bg-new-light-grey min-h-[200px] text-white placeholder:text-lightGray placeholder:font-light focus:placeholder:opacity-0 text-base resize-none"
            placeholder={t("reviews.comment_placeholder")}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            maxLength={2000}
          />
          <button className="bg-mainColor text-black rounded-[10px] py-3 font-medium" onClick={sendAnswer}>
            {addCommentRequestMock.isAddCommentLoading || addCommentRequestMock.isAddCommentFetching ? (
              <Loader className="animate-spin size-6 text-black mx-auto" />
            ) : (
              t("reviews.send")
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
