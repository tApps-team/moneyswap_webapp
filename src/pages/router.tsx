import { createBrowserRouter } from "react-router-dom";
import { paths } from "@/shared/routing";
import { applyStartParam } from "@/shared/lib/start-param";
import { NotFoundPage } from "./notFound";
import { MainPage } from "./main";
import { RootLayout } from "./layouts";

// Разворачиваем `startapp` из внешней ссылки в обычные search-параметры.
//
// Вызов обязан стоять именно здесь: createBrowserRouter снимает window.location в момент
// вычисления модуля, а модули вычисляются раньше любой строки main.tsx — из main.tsx URL
// правился бы уже после снимка, и роутер продолжал бы видеть исходный адрес.
// К этому моменту telegram-web-app.js уже отработал (обычный <script> идёт раньше module),
// поэтому запасной источник initDataUnsafe.start_param тоже доступен.
applyStartParam();

export const router = createBrowserRouter([
  {
    path: paths.main,
    element: <RootLayout />,
    children: [
      {
        path: paths.main,
        element: <MainPage />,
      },
      {
        path: paths.notFound,
        element: <NotFoundPage />,
      },
    ],
  },
]);
