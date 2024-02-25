import { atom } from "recoil";

export type Language = "ko" | "en";

export const languageState = atom<Language>({
  key: "language",
  default: (localStorage.getItem("language") as Language) || "ko",
});
