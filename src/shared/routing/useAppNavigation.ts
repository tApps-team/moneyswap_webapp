import { startTransition, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { RatingSectionKey, isRatingSectionKey } from "@/shared/config";
import { appTabs, isAppTab, navQuery } from "./paths";

/**
 * Навигация мини-аппа поверх search-параметров.
 *
 * Роут остаётся один («/»), поэтому перезагрузка страницы не зависит от SPA-fallback
 * на сервере, а история браузера и Telegram BackButton работают штатно.
 * Параметры бота (`from_site`, `direction`, `user_id`, `user_lang`) не трогаем —
 * setSearchParams получает копию текущих параметров.
 */
export const useAppNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = isAppTab(searchParams.get(navQuery.tab))
    ? (searchParams.get(navQuery.tab) as appTabs)
    : appTabs.exchange;

  const sectionParam = searchParams.get(navQuery.section);
  const section: RatingSectionKey | null = isRatingSectionKey(sectionParam) ? sectionParam : null;

  const item = searchParams.get(navQuery.item);

  const update = useCallback(
    (
      patch: Partial<Record<keyof typeof navQuery, string | null>>,
      options?: { replace?: boolean },
    ) => {
      // Вкладки рейтингов/ЧС/«Ещё» подгружаются через React.lazy. Без startTransition
      // React считает такое обновление синхронным ответом на ввод и падает с
      // «A component suspended while responding to synchronous input».
      startTransition(() => {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(patch).forEach(([key, value]) => {
              const param = navQuery[key as keyof typeof navQuery];
              if (value === null) next.delete(param);
              else next.set(param, value);
            });
            return next;
          },
          { replace: options?.replace },
        );
      });
    },
    [setSearchParams],
  );

  const openTab = useCallback(
    (nextTab: appTabs) => {
      // При смене вкладки сбрасываем вложенность, иначе «Назад» уведёт в чужой раздел.
      update({
        tab: nextTab === appTabs.exchange ? null : nextTab,
        section: null,
        item: null,
      });
    },
    [update],
  );

  const openSection = useCallback(
    (nextSection: RatingSectionKey) => update({ section: nextSection, item: null }),
    [update],
  );

  const openItem = useCallback((slug: string) => update({ item: slug }), [update]);

  const closeItem = useCallback(() => update({ item: null }), [update]);

  const closeSection = useCallback(() => update({ section: null, item: null }), [update]);

  /** Один шаг назад по глубине: карточка → раздел → хаб → «Обмен». */
  const goBack = useCallback(() => {
    if (item) return closeItem();
    if (section) return closeSection();
    if (tab !== appTabs.exchange) return openTab(appTabs.exchange);
  }, [item, section, tab, closeItem, closeSection, openTab]);

  /**
   * Есть ли куда возвращаться по глубине навигации.
   * Открытый drawer сюда не входит: он вешает свой обработчик «Назад» с более высоким
   * приоритетом и закрывается первым.
   */
  const canGoBack = useMemo(
    () => tab !== appTabs.exchange || Boolean(section),
    [tab, section],
  );

  return {
    tab,
    section,
    item,
    openTab,
    openSection,
    openItem,
    closeItem,
    closeSection,
    goBack,
    canGoBack,
  };
};
