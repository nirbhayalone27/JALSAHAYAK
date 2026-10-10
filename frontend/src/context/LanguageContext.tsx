import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, LanguageCode } from '../locales/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultVal?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, defaultVal?: string) => defaultVal || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('jalsahayak_lang') as LanguageCode;
    return saved === 'hi' ? 'hi' : 'en'; // Default to English
  });

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    localStorage.setItem('jalsahayak_lang', newLang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const t = (key: string, defaultVal?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key]) return langDict[key];
    const fallbackDict = TRANSLATIONS.en;
    return fallbackDict[key] || defaultVal || key;
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
