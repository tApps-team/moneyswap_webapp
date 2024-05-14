import { Name } from "@/shared/config";

export type Country = {
  id: number;
  name: Name;
  icon_url: string;
  cities: City[];
};

export type City = {
  id: number;
  name: Name;
  code_name: string;
};
