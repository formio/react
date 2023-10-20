import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import englishTranslation from './translations/en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translations: englishTranslation
      },
    },
    fallbackLng: 'en',
    ns: 'translations',
    keySeparator: false, // recommended when working with flat objects
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
