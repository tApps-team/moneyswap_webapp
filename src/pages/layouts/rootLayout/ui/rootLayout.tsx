import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import { Toaster } from "@/shared/ui";
import { isTelegramMobile } from "@/shared/lib";
import { RootBg } from "./rootBg";
import styles from "./rootLayout.module.scss";

export const RootLayout = () => {
  const isMobilePlatform = isTelegramMobile();
  
  return (
    <div className={clsx(styles.root__container, {
      [styles.root__container_mobile]: isMobilePlatform
    })}>
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
