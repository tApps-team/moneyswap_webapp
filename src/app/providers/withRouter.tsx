import { router } from "@/pages/router";
import { RouterProvider } from "react-router-dom";

export const withRouter = () => {
  return () => <RouterProvider router={router} />;
};
