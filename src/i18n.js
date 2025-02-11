import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';
import zhHK from './locales/zh-HK.json';

i18n
  .use(LanguageDetector) // 自動偵測使用者語言
  .use(initReactI18next) // React integration
  .init({
    resources: {
      en: { translation: en },
      'zh-CN': { translation: zhCN },
      'zh-TW': { translation: zhTW },
      'zh-HK': { translation: zhHK },
    },
    fallbackLng: 'en', // 預設語言
    interpolation: {
      escapeValue: false, // 避免 React 自動跳脫字串
    },
  });

export default i18n;
