// File Path: App.tsx

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator'; 
import { LanguageProvider } from './src/context/LanguageContext';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <LanguageProvider>
      {/*
        The StatusBar component is placed here so it's always available
        across the entire app.
      */}
      <StatusBar style="auto" />
      {/* The AppNavigator component now sits at the top level,
        handling all screen rendering and full-screen layout.
        The surrounding View component and styles have been removed
        as they are redundant and can cause rendering issues.
      */}
      <AppNavigator />
    </LanguageProvider>
  );
}

