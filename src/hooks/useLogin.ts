import { useState } from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
  const { login, loginAsGuest } = useAuth();
  const navigation = useNavigation();
  const [apiError, setApiError] = useState<string>('');

  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password);
    if (result.success) {
      navigation.dispatch(StackActions.replace('Home'));
    } else {
      setApiError(result.error || 'unknownError');
    }
  };

  const handleGuestLogin = async () => {
    const result = await loginAsGuest();
    if (result.success) {
      navigation.dispatch(StackActions.replace('Home'));
    } else {
      setApiError('unknownError');
    }
  };

  const goToSignUp = () => {
    navigation.navigate('Signup');
  };

  return { apiError, handleLogin, handleGuestLogin, goToSignUp };
};
