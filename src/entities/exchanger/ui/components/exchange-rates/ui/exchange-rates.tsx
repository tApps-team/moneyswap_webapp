import { ExchangeRate } from "@/entities/exchanger/model";
import { RoundValute } from "@/shared/ui/roundValute";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface ExchangeRatesProps {
  rates: ExchangeRate[] | null;
  valuteFrom: string;
  valuteTo: string;
}

const smartRound = (num: number) => {
  const decimal = num.toString().split('.')[1];
  if (!decimal || decimal.length <= 3) return num;
  return Number(num.toFixed(3));
};

export const ExchangeRates: FC<ExchangeRatesProps> = ({ rates, valuteFrom, valuteTo }) => {
  const { t } = useTranslation();
  if (!rates || rates.length === 0) return null;

  const sortedRates = [...rates].sort((a, b) => {
    const aCount = (!a.min_count || a.min_count === 0) ? 1 : a.min_count;
    const bCount = (!b.min_count || b.min_count === 0) ? 1 : b.min_count;
    return aCount - bCount;
  });

  return (
    <div className="grid gap-0.5 gap-x-1 text-[10px] text-gray-400 pt-2 border-t border-[#575A62] w-full mt-2" style={{ gridTemplateColumns: 'max-content min-content max-content' }}>
      {sortedRates.map((rate, index) => {
        const minCount = (!rate.min_count || rate.min_count === 0) ? 1 : rate.min_count;
        const isInCountBigger = rate.in_count > rate.out_count;
        
        return (
          <div key={index} className="contents">
            <div className="flex items-end gap-1 min-w-0 leading-none whitespace-nowrap">
              {!isInCountBigger && <span className="flex items-end gap-1 text-[8px]">{t("от")} <span className="text-gray-300 text-[10px] leading-none">{minCount}</span></span>}
              {isInCountBigger && <span className="text-gray-300 leading-none">
                <RoundValute value={smartRound(rate.in_count)} />
              </span>}
              <span className="truncate max-w-[18vw] inline-block text-[8px]">{valuteFrom}</span>
            </div>
            <span className="text-[10px] flex-shrink-0 leading-none">→</span>
            <div className="flex items-end gap-1 min-w-0 leading-none whitespace-nowrap">
              {isInCountBigger && <span className="flex items-end gap-1 text-[8px]">{t("от")} <span className="text-gray-300 text-[10px] leading-none">{minCount}</span></span>}
              {!isInCountBigger && <span className="text-gray-300 leading-none">
                <RoundValute value={smartRound(rate.out_count)} />
              </span>}
              <span className="truncate max-w-[18vw] inline-block text-[8px]">{valuteTo}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
