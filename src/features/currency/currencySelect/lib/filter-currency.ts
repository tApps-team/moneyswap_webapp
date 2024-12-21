import { CurrencyValutes } from "@/entities/currency";

type FilteredTabListProps = {
  tabList: CurrencyValutes[];
  searchValue: string;
};
export const filterTabList = (props: FilteredTabListProps) => {
  const { searchValue, tabList } = props;
  const lowerSearchValue = searchValue.toLowerCase();
  return tabList.reduce<CurrencyValutes[]>((acc, cur) => {
    const filteredCurrencies = cur.currencies.filter(
      (currency) =>
        currency.code_name.toLowerCase().includes(lowerSearchValue) ||
        currency.name.ru.toLowerCase().includes(lowerSearchValue)
    );
    if (filteredCurrencies.length > 0) {
      acc.push({
        ...cur,
        currencies: filteredCurrencies,
      });
    }
    return acc;
  }, []);
};
