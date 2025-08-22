import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';
import { en } from '../localization/en';
import { ar } from '../localization/ar';

type Language = 'en' | 'ar';
type Dictionary = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  i18n: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const translations: Record<Language, Dictionary> = {
    en: en,
    ar: ar,
  };

  const i18n = translations[language];

  const updateLayoutDirection = async (lang: Language) => {
    const isRTL = lang === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      try {
        I18nManager.forceRTL(isRTL);
        I18nManager.allowRTL(true);
        await Updates.reloadAsync();
      } catch (e) {
      }
    }
  };

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('@app_language');
        if (storedLanguage) {
          setLanguageState(storedLanguage as Language);
          updateLayoutDirection(storedLanguage as Language);
        } else {
          updateLayoutDirection('en');
        }
      } catch (error) {
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('@app_language', lang);
      setLanguageState(lang);
      updateLayoutDirection(lang);
    } catch (error) {
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, i18n }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
