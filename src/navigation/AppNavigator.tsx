import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useLanguage } from '../context/LanguageContext';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { RootStackParamList } from './NavigationParams';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { i18n } = useLanguage();

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        gestureEnabled: false,
        headerTitleAlign: 'center',
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: true, title: i18n.common.signup }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: true, headerTitle: '' }} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ headerShown: true, title: i18n.common.eventInfo }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, title: i18n.common.profile }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
