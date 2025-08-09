import "i18next";
import commonEs from "../locales/es/common.json";

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "common";
        resources: {
            common: typeof commonEs;
        };
    }
}
