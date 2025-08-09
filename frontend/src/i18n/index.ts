import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import esCommon from "../locales/es/common.json";
import enCommon from "../locales/en/common.json";

void i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "es",
        supportedLngs: ["es", "en"],
        ns: ["common"],
        defaultNS: "common",
        debug: import.meta.env.DEV,
        resources: {
            es: { common: esCommon },
            en: { common: enCommon },
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json"
        },
        detection: {
            order: ["querystring", "localStorage", "navigator"],
            caches: ["localStorage"]
        }
    });

export default i18n;
