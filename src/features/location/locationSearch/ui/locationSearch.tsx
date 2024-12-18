import { FC } from "react";
import { SearchIcon } from "@/shared/assets";
import { useTranslation } from "react-i18next";
import { Input } from "@/shared/ui";

interface LocationSearchProps {
  searchValue: string;
  onChange: (value: string) => void;
}

export const LocationSearch: FC<LocationSearchProps> = ({
  searchValue,
  onChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 translate-y-[8px] size-[30px]" />
      <Input
        placeholder={t("Поиск страны и города")}
        className="h-[45px] text-[#b9b9b9] text-[16px] rounded-[10px] font-medium pl-12 bg-new-light-grey border-none placeholder:text-[#b9b9b9] placeholder:transition-opacity focus:placeholder:opacity-0"
        value={searchValue}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
