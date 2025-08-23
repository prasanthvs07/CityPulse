import { useState, useCallback } from 'react';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  reEnterPassword: string;
}

export const useSignUp = () => {
  const navigation = useNavigation();
  const { i18n } = useLanguage();
  const { registerUser } = useAuth();
  const [apiError, setApiError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<SignUpFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      reEnterPassword: '',
    },
    mode: 'onChange',
  });

  const onFormSubmit = useCallback(
    async (data: SignUpFormData) => {
      setApiError('');

      const result = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        navigation.dispatch(
          StackActions.replace('Home')
        );
      } else {
        setApiError(result.message || i18n.common.genericError);
      }
    },
    [registerUser, navigation]
  );

  return {
    control,
    handleSubmit,
    onFormSubmit,
    errors,
    isValid,
    apiError,
    watch,
    reset,
    i18n,
  };
};
