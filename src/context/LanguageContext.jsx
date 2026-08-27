import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, supportedLanguages } from '../utils/translations';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'tui_blue_selected_language';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ['tr', 'en', 'ru', 'de'].includes(saved)) {
        return saved;
      }
      // Auto-detect browser language
      const browserLang = navigator.language?.slice(0, 2)?.toLowerCase();
      if (['tr', 'ru', 'de'].includes(browserLang)) {
        return browserLang;
      }
      return 'en'; // default English
    } catch {
      return 'en';
    }
  });

  const setLanguage = useCallback((lang) => {
    if (['tr', 'en', 'ru', 'de'].includes(lang)) {
      setLanguageState(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        console.warn('Failed to save language to localStorage:', e);
      }
    }
  }, []);

  // Translation helper function
  const t = useCallback(
    (key) => {
      const currentDict = translations[language] || translations.en;
      if (currentDict && key in currentDict) {
        return currentDict[key];
      }
      // Fallback to English
      if (translations.en && key in translations.en) {
        return translations.en[key];
      }
      return key;
    },
    [language]
  );

  // Dynamic multilingual field resolver for DB objects (e.g. title_tr, title_en)
  const getLocalizedField = useCallback(
    (item, baseFieldName) => {
      if (!item) return '';

      // Direct target key: e.g. title_tr
      const targetKey = `${baseFieldName}_${language}`;
      if (item[targetKey] && item[targetKey].trim() !== '') {
        return item[targetKey];
      }

      // Fallback 1: English
      const enKey = `${baseFieldName}_en`;
      if (item[enKey] && item[enKey].trim() !== '') {
        return item[enKey];
      }

      // Fallback 2: Turkish
      const trKey = `${baseFieldName}_tr`;
      if (item[trKey] && item[trKey].trim() !== '') {
        return item[trKey];
      }

      // Fallback 3: Generic base field name if exists
      if (item[baseFieldName]) {
        return item[baseFieldName];
      }

      return '';
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getLocalizedField,
        supportedLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
