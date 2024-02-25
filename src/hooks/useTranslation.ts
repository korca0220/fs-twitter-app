import { languageState } from "atom";
import { TRANSLATIONS } from "constants/lnaguage";
import { useRecoilValue } from "recoil";

export function useTranslation() {
  const lang = useRecoilValue(languageState);

  return (key: keyof typeof TRANSLATIONS) => {
    return TRANSLATIONS[key][lang];
  };
}
