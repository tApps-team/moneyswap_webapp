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
  const [whole, decimal] = num.toString().split('.');
  if (!decimal || decimal.length <= 3) return num;
  return Number(`${whole}.${decimal.slice(0, 3)}`);
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
    <div className="flex flex-col gap-0.5 text-[10px] text-gray-400 pt-2 border-t border-[#575A62] w-full mt-2">
      {sortedRates.map((rate, index) => {
        const minCount = (!rate.min_count || rate.min_count === 0) ? 1 : rate.min_count;
        const inAmount = smartRound(minCount * rate.in_count);
        const outAmount = smartRound(minCount * rate.out_count);
        const isInCountSmaller = rate.in_count <= rate.out_count;
        
        return (
          <div key={index} className="flex items-center gap-1 w-full">
            <div className="flex items-end gap-1 min-w-0 leading-none">
              {isInCountSmaller && <span className="mb-[0.5px] text-[8px]">{t("от")}</span>}
              <span className="text-gray-300 leading-none"><RoundValute value={inAmount} /></span>
              <span className="mb-[0.5px] truncate max-w-[18vw] inline-block text-[8px]">{valuteFrom}</span>
            </div>
            <span className="text-xs flex-shrink-0 leading-none">→</span>
            <div className="flex items-end gap-1 min-w-0 leading-none">
              {!isInCountSmaller && <span className="mb-[0.5px] text-[8px]">{t("от")}</span>}
              <span className="text-gray-300 leading-none"><RoundValute value={outAmount} /></span>
              <span className="mb-[0.5px] truncate max-w-[18vw] inline-block text-[8px]">{valuteTo}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
