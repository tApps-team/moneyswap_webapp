import { createBrowserRouter } from "react-router-dom";
import { paths } from "@/shared/routing";
import { NotFoundPage } from "./notFound";
import { MainPage } from "./main";
import { RootLayout } from "./layouts";

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
