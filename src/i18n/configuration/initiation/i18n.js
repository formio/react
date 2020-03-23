import i18next from 'i18next';
import arTranslation from '../../translations/ar';
import enTranslation from '../../translations/en';
import translationConfig from '../../translationConfig';

i18next
  .init({
    lng: translationConfig.defaultLanguage,
    debug: true,
    resources: {...translationConfig.i18nConfig},
    fallbackLng: translationConfig.availableLanguages,
    keySeparator: false,
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    react: {
      wait: true,
      useSuspense: false
    }
  }, (err, t) => {
    if (err) return console.log('i18n error', err);
  }
);

export default i18next;

