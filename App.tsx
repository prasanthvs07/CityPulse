import React from 'react';
import AppNavigator from './src/navigation/AppNavigator'; 
import { LanguageProvider } from './src/context/LanguageContext';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider} from './src/context/AuthContext'
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </LanguageProvider>
  );
}