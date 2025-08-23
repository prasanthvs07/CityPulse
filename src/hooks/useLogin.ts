import { useState } from 'react';
import { useAuth } from './useAuth';
import { StackActions, useNavigation } from '@react-navigation/native';

export const useLogin = () => {
  const { login, loginAsGuest } = useAuth();
  const navigation = useNavigation();
  const [apiError, setApiError] = useState<string>('');

  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password);
    if (result.success) {
      navigation.dispatch(StackActions.replace('Home'));
    } else {
      setApiError(result.message || 'Login failed');
    }
  };

  const handleGuestLogin = async () => {
    const result = await loginAsGuest();
    if (result.success) {
      navigation.dispatch(StackActions.replace('Home'));
    } else {
      setApiError(result.message || 'Login failed');
    }
  };

  const goToSignUp = () => {
    navigation.navigate('Signup');
  };

  return { apiError, handleLogin, handleGuestLogin, goToSignUp };
};
