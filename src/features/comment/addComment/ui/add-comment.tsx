import { FC, useState } from "react";
import { Send } from "lucide-react";
import { ExchangerMarker } from "@/shared/types";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, ScrollArea } from "@/shared/ui";

type AddCommentProps = {
  reviewText: string;
  exchanger_id: number;
  exchanger_marker: ExchangerMarker;
  review_id: number
}

export const AddComment:FC<AddCommentProps> = ({
  reviewText,
  exchanger_id,
  exchanger_marker,
  review_id,
}) => {
  const [answer, setAnswer] = useState<string>("");
  const sendAnswer = () => {
    const answerReq = {
        answer: answer,
        review_id: review_id,
        exchanger_id: exchanger_id,
        exchanger_marker: exchanger_marker,
    }
    console.log(answerReq);
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full flex items-center justify-end gap-2 text-mainColor font-medium uppercase text-xs px-4 pt-1.5">
        Ответить
        <Send className="size-4 stroke-[2px]" />
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogTitle>Комментарий для отзыва:</DialogTitle>
        <ScrollArea className="max-h-[200px] overflow-y-auto my-4 p-2 bg-neutral-900 rounded text-white text-sm">
          {reviewText}
        </ScrollArea>
          <textarea
            className="rounded bg-neutral-800 text-white p-2 min-h-[80px]"
            placeholder="Введите комментарий..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button className="bg-mainColor text-black rounded py-2 font-semibold mt-2" onClick={sendAnswer}>
            Ответить
          </button>
      </DialogContent>
    </Dialog>
  );
};
