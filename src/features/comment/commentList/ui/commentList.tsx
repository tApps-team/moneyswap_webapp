import { Comment, CommentCard } from "@/entities/comment";
import { Role } from "@/shared/types";

type CommentListProps = {
  comments?: Comment[];
};
const mockComments: Comment[] = [
  {
    id: 1,
    comment_date: "30.04.2024",
    comment_time: "10:15",
    text: "Отличный продукт, пользуюсь уже неделю и очень доволен!",
    role: Role.user,
    name: "Иван Иванов",
  },
  {
    id: 2,
    comment_date: "30.04.2024",
    comment_time: "11:20",
    text: "Не рекомендую, качество оставляет желать лучшего.",
    role: Role.user,
    name: "Анна Петрова",
  },
  {
    id: 3,
    comment_date: "30.04.2024",
    comment_time: "12:35",
    text: "Спасибо за ваш отзыв! Мы уже работаем над улучшением качества.",
    role: Role.admin,
    name: "Администратор",
  },
  {
    id: 4,
    comment_date: "30.04.2024",
    comment_time: "09:50",
    text: "Доставка быстрая, товар соответствует описанию.",
    role: Role.user,
    name: "Сергей Сидоров",
  },
  {
    id: 5,
    comment_date: "30.04.2024",
    comment_time: "10:05",
    text: "Возникли проблемы с оплатой, но служба поддержки быстро помогла.",
    role: Role.user,
    name: "Мария Смирнова",
  },
  {
    id: 6,
    comment_date: "30.04.2024",
    comment_time: "11:15",
    text: "Рады, что смогли вам помочь! Благодарим за понимание.",
    role: Role.admin,
    name: "Администратор",
  },
  {
    id: 7,
    comment_date: "30.04.2024",
    comment_time: "12:00",
    text: "Купил в подарок, получатель в восторге!",
    role: Role.user,
    name: "Алексей Кузнецов",
  },
  {
    id: 8,
    comment_date: "30.04.2024",
    comment_time: "12:45",
    text: "Не хватает инструкции по сборке, пришлось искать в интернете.",
    role: Role.user,
    name: "Ольга Павлова",
  },
  {
    id: 9,
    comment_date: "30.04.2024",
    comment_time: "13:30",
    text: "Спасибо за ваше замечание! Мы добавим инструкцию в ближайшее время.",
    role: Role.admin,
    name: "Администратор",
  },
  {
    id: 10,
    comment_date: "30.04.2024",
    comment_time: "14:15",
    text: "Цена немного завышена, но качество на высоте.",
    role: Role.user,
    name: "Виктор Никифоров",
  },
];

export const CommentList = (props: CommentListProps) => {
  const { comments, isOpen } = props;
  return (
    <div>
      {mockComments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
