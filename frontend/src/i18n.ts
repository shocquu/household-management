import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/locales/en.json';
import de from './translations/locales/de.json';
import pl from './translations/locales/pl.json';

const resources = {
    en: {
        translation: en,
    },
    de: {
        translation: de,
    },
    pl: {
        translation: pl,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
