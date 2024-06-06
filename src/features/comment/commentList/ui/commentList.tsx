import { Comment, CommentCard } from "@/entities/comment";
import { Role } from "@/shared/types";
import { cx } from "class-variance-authority";
import { useState, useEffect, useRef } from "react";

const mockComments: Comment[] = [
  {
    id: 9,
    comment_date: "30.04.2024",
    comment_time: "13:30",
    text: "Спасибо за ваше замечание! Мы добавим инструкцию в ближайшее время.",
    role: Role.admin,
  },
  {
    id: 10,
    comment_date: "30.04.2024",
    comment_time: "14:15",
    text: "Цена немного завышена, но качество на высоте.",
    role: Role.admin,
    name: "Виктор Никифоров",
  },
];

type CommentListProps = {
  comments?: Comment[];
  isOpen: boolean;
};

export const CommentList = (props: CommentListProps) => {
  const { comments = mockComments, isOpen } = props;
  const [height, setHeight] = useState<undefined | number | string>(
    isOpen ? "auto" : 0
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHeight(ref.current?.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      style={{ height }}
      className={cx(
        "-translate-y-[50px] transition-all relative z-[-1]  duration-500 ease-in-out overflow-hidden rounded-[25px] bg-mainColor",
        height !== 0 && "-mb-[50px]"
      )}
    >
      <div className={cx("p-4 grid first:pt-[50px]")}>
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
