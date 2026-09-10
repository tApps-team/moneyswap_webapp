import { lazy, Suspense } from "react";
import { Loader } from "lucide-react";
import { ExchangePage } from "@/pages/exchange";
import { appTabs, useAppNavigation } from "@/shared/routing";

/**
 * Оболочка вкладок.
 *
 * Экран обмена всегда смонтирован и лишь скрывается: его эффекты инициализируют Telegram
 * (expand/fullscreen/BackButton) и направление обмена, а состояние формы и выбранный город
 * живут в компонентах. Размонтирование сбрасывало бы всё это при каждом заходе в рейтинги.
 *
 * Остальные вкладки грузятся лениво, чтобы код рейтингов не попадал в стартовый чанк.
 */
const RatingsPage = lazy(() =>
  import("@/pages/ratings").then((module) => ({ default: module.RatingsPage })),
);
const BlacklistPage = lazy(() =>
  import("@/pages/blacklist").then((module) => ({ default: module.BlacklistPage })),
);
const MorePage = lazy(() =>
  import("@/pages/more").then((module) => ({ default: module.MorePage })),
);

const TabFallback = () => (
  <div className="flex justify-center items-center h-[60svh]">
    <Loader className="animate-spin size-6 text-mainColor" />
  </div>
);

export const MainPage = () => {
  const { tab } = useAppNavigation();
  const isExchange = tab === appTabs.exchange;

  return (
    <>
      <div hidden={!isExchange}>
        <ExchangePage />
      </div>

      {!isExchange && (
        <Suspense fallback={<TabFallback />}>
          {tab === appTabs.ratings && <RatingsPage />}
          {tab === appTabs.blacklist && <BlacklistPage />}
          {tab === appTabs.more && <MorePage />}
        </Suspense>
      )}
    </>
  );
};
