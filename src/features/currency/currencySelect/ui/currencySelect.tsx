import { Currency, CurrencyCard, CurrencyCategory } from "@/entities/currency";
import { CloseDrawerIcon, SearchIcon } from "@/shared/assets";
import {
  Button,
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  Empty,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { cx } from "class-variance-authority";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

type CurrecnySelectProps = {
  label: string;
  currencyInfo?: Partial<Omit<Currency, "id">>;
  disabled?: boolean;
  currencies?: CurrencyCategory;
  emptyLabel?: string;
  onClick?: (currency: Currency) => void;
};
export const CurrencySelect = (props: CurrecnySelectProps) => {
  const { currencies, disabled, emptyLabel, onClick, currencyInfo, label } =
    props;
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState<string>("");
  const searchDeferredValue = useDeferredValue(searchValue);
  const allKey = t("ВСЕ");

  const [activeTab, setActiveTab] = useState<string>(allKey);

  const currentCurrniesWithCategories: CurrencyCategory = useMemo(
    () => ({
      [allKey]: Object.values(currencies || {}).flat() || [],
      ...currencies,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currencies]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setActiveTab(filteredCategories.categories[0] || allKey);
  };

  const filteredCategories = useMemo(() => {
    const filteredKeys = Object.keys(currentCurrniesWithCategories).filter(
      (filterKey) =>
        currentCurrniesWithCategories[filterKey].some((currency) =>
          currency?.name
            ?.toLowerCase()
            ?.includes(searchDeferredValue?.toLowerCase())
        )
    );

    return {
      categories: filteredKeys,
    };
  }, [currentCurrniesWithCategories, searchDeferredValue]);
  const scrollToActiveTab = useCallback(() => {
    if (api) {
      const scrollIndex = Object.keys(currentCurrniesWithCategories).findIndex(
        (tab) => tab === activeTab
      );

      api?.scrollTo(scrollIndex);
    }
  }, [activeTab, api, currentCurrniesWithCategories]);
  useEffect(() => {
    if (api) {
      scrollToActiveTab();
    }
  }, [api, scrollToActiveTab]);
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={cx(
            "w-full h-[70px] transition-none bg-transparent border disabled:bg-opacity-0 flex items-center justify-start gap-3 rounded-full",
            currencyInfo && "border-mainColor bg-mainColor"
          )}
          disabled={disabled}
        >
          {currencyInfo ? (
            <img
              src={currencyInfo.icon_url}
              alt={`иконка ${currencyInfo?.name}`}
              width={40}
              height={40}
              loading="lazy"
            />
          ) : (
            <div className="border rounded-full size-10" />
          )}
          {currencyInfo ? (
            <div className="grid grid-rows-2 items-center justify-start h-full text-darkGray text-[16px]">
              <p className="font-semibold text-start uppercase leading-0 truncate">
                {currencyInfo?.name}
              </p>
              <p className="leading-0 truncate text-start font-normal">
                {currencyInfo?.code_name}
              </p>
            </div>
          ) : (
            <div className="uppercase truncate text-white font-normal">
              {emptyLabel}
            </div>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="min-h-svh p-4 bg-transparent border-none">
        <DrawerHeader className="text-start text-mainColor text-lg p-0 grid gap-4 pt-4">
          <div className="relative">
            <h2 className="text-left font-semibold text-base uppercase text-[#f6ff5f]">
              {label}
            </h2>
            <DrawerClose className="absolute right-0 top-0">
              <CloseDrawerIcon width={26} height={26} fill={"#f6ff5f"} />
            </DrawerClose>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-2 translate-y-[6px] size-[30px]" />
            <Input
              placeholder={t("ПОИСК ВАЛЮТЫ")}
              className="rounded-2xl font-medium pl-12 bg-lightGray border-none placeholder:text-darkGray placeholder:transition-opacity text-darkGray uppercase focus:placeholder:opacity-0"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </DrawerHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="">
          <TabsList
            data-vaul-no-drag
            className="bg-transparent  w-full h-full py-4"
          >
            <Carousel
              ref={carouselRef}
              setApi={setApi}
              opts={{ slidesToScroll: 1 }}
              className=" w-full"
            >
              <CarouselContent className="m-0 w-full gap-2 ">
                {filteredCategories.categories?.map((filteredCategory) => (
                  <CarouselItem
                    key={filteredCategory}
                    className="w-full  basis-2/5"
                  >
                    <TabsTrigger
                      className={
                        "rounded-2xl border-lightGray  border w-full  uppercase data-[state=active]:text-black data-[state=active]:border-mainColor text-white  h-11 data-[state=active]:bg-mainColor shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)]"
                      }
                      value={filteredCategory}
                    >
                      <p className="truncate leading-0 font-medium">
                        {filteredCategory}
                      </p>
                    </TabsTrigger>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </TabsList>
          {filteredCategories.categories.length === 0 && (
            <div className="grid justify-items-center gap-4 col-span-2">
              <img src="/img/notfound.gif" className="w-[60px] h-[60px]" />
              <Empty text={t("Ничего не найдено...")} />
            </div>
          )}
          <div className="bg-lightGray pb-[2px] rounded-xl -mx-4" />
          <div className="">
            <div
              data-vaul-no-drag
              className="h-[calc(100svh_-_190px)] -mx-4 bg-[url('/img/authBg_rotate_cut.jpg')] bg-cover py-4 overflow-auto"
            >
              {filteredCategories?.categories.map((filteredCategory) => {
                if (filteredCategory !== activeTab) return null;
                return (
                  <TabsContent
                    className="grid mt-0 grid-rows-1 gap-2 px-4 pb-2 pt-1"
                    key={filteredCategory}
                    value={filteredCategory}
                  >
                    {currentCurrniesWithCategories[filteredCategory]
                      ?.filter((currency) =>
                        currency?.name
                          ?.toLowerCase()
                          ?.includes(searchDeferredValue?.toLowerCase())
                      )
                      .map((currency) => (
                        <DrawerClose key={currency?.id} asChild>
                          <CurrencyCard
                            active={
                              currency.code_name === currencyInfo?.code_name
                            }
                            onClick={() => onClick?.(currency)}
                            currency={currency}
                          />
                        </DrawerClose>
                      ))}
                  </TabsContent>
                );
              })}
            </div>
          </div>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};
