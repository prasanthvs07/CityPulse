import { useState, useCallback } from 'react';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  reEnterPassword: string;
}

export const useSignUp = () => {
  const navigation = useNavigation();
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
        setApiError(result.error || 'unknownError');
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
  };
};
