import { FC, memo, useEffect, useMemo } from "react";
import { Categories } from "../../model/Categories";
import { useFiltersStore } from "../../store/store";
import { TabsItem } from "../ui/tabs/tabs";
import styles from "./optionFilter.module.scss";
import { Tab } from "../ui/tabs/tab";
import { useTranslation } from "react-i18next";
interface OptionFilterProps {
  categories: Categories;
}

export const OptionFilter: FC<OptionFilterProps> = memo(({ categories }) => {
  const filter = useFiltersStore((state) => state.filter);
  const setFilter = useFiltersStore((state) => state.setFilter);
  const search = useFiltersStore((state) => state.search);
  const filteredCategories = Object.keys(categories).filter((category) =>
    categories[category]?.some((option) =>
      option.name.toLowerCase().includes(search.toLowerCase())
    )
  );
  const { t } = useTranslation();
  const tabsItem: TabsItem[] = useMemo(
    () => [
      { value: null, content: t("Все") },
      ...filteredCategories.map((category) => ({
        value: category,
        content: category,
      })),
    ],
    [filteredCategories, t]
  );

  const handleCategory = (category: string | null) => {
    setFilter(category);
  };

  useEffect(() => {
    setFilter(null);
  }, [search, setFilter]);

  return (
    <div className={styles.filter}>
      {tabsItem.map((tab) => (
        <Tab
          onTabClick={(tab) => handleCategory(tab.value)}
          classNameTabItem={styles.filter_tab_item}
          tab={tab}
          filter={filter}
          key={tab.content}
        />
      ))}
    </div>
  );
});
