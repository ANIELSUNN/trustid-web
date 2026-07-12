import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('trustid_lang') || 'fr'
  );

  const changeLang = (code) => {
    localStorage.setItem('trustid_lang', code);
    setLang(code);
  };

  const t = translations[lang] || translations.fr;

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
