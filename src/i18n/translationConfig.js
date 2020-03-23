import arTranslation from './translations/ar';
import enTranslation from './translations/en';

const translationConfig = {
  defaultLanguage: 'ar',
  formsConfig: {...arTranslation, ...enTranslation},
  i18nConfig:{
    en: {translation: enTranslation.en},
    ar: {translation: arTranslation.ar},
  },
  availableLanguages: ['ar', 'en']
};

export default translationConfig;
