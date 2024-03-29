import { TabsItem } from "../components/ui/tabs/tabs";

// Query chache key no cash
export const optionsKey = "Options";
export const availableKey = "Available";
export const exchangersKey = "Exchangers";
// Query chache key cash
export const countriesKey = "Countries";
export const citiesKey = "Cities";
export const availableValutesKey = "AvailableValutes";
export const directionCashKey = "directionCashKey";

// DirectionTabs type valute
export const directionTabsValute: TabsItem[] = [
    {
        value: 'noCash',
        content: "Безналичные"
    },
    {
        value: 'cash',
        content: "Наличные"
    },
];
