import { Outlet } from "react-router-dom";
import styles from "./rootLayout.module.scss";
import { RootBg } from "./rootBg";
import { Toaster } from "@/shared/ui";
import { Suspense } from "react";

export const RootLayout = () => {
  return (
    <div className={styles.root__container}>
      <Toaster />
      <Suspense fallback={<div>Loading...</div>}>
        <main className={styles.root__content}>
          <Outlet />
          <RootBg />
        </main>
      </Suspense>
    </div>
  );
};
