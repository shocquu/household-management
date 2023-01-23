import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
// import pl from './locales/pl.json';

export enum LanguageOptions {
    EN = 'en',
    PL = 'pl',
    DE = 'de',
}

export const DEFAULT_LANGUAGE = LanguageOptions.EN;
// export type TFunctionArgumentType = Normalize<typeof en>;

i18n.use(initReactI18next).init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    returnEmptyString: false,
    resources: {
        en: { translation: en },
        //   pl: { translation: pl },
    },
    react: {
        useSuspense: false,
    },
});

export default i18n;
