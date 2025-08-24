import React from 'react';
import AppNavigator from './src/navigation/AppNavigator'; 
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { I18nManager } from 'react-native';

const RootApp = () => {
  const { language, i18n } = useLanguage();
  console.log(language, i18n)
  return (
    <NavigationContainer key={language}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RootApp />
      </AuthProvider>
    </LanguageProvider>
  );
}