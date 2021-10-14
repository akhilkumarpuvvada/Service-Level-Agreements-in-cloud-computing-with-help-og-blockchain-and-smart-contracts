import i18n from "i18next";
import LanguageDecorator from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import XHR from "i18next-xhr-backend";
import EN from "./i18n/en.json";
import ES from "./i18n/es.json";

i18n
  .use(XHR)
  .use(LanguageDecorator)
  .use(initReactI18next)
  .init({
    resources: {
      en: EN,
      es: ES,
    },
    lng: "en",
    fallbackLng: "en",
  });

export default i18n;
