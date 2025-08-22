import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, StackActions } from '@react-navigation/native';
import { theme } from '../theme/theme';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import { useLanguage } from '../context/LanguageContext';
import icon from '../../assets/splash-icon.png';
import { useStorage } from '../hooks/useStorage';
import { User } from '../types/types';

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  reEnterPassword: string;
}

const SignUpScreen: React.FC = () => {
  const [apiError, setApiError] = useState('');
  const { registerUser } = useStorage();
  const { i18n } = useLanguage();
  const navigation = useNavigation();

  const getStringForKey = (key: string): string => {
    return i18n.common[key] || i18n.common.genericError;
  };

  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<SignUpFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      reEnterPassword: '',
    },
    mode: 'onChange',
  });

  const onFormSubmit = useCallback(async (data: SignUpFormData) => {
    setApiError('');

    const newUser: User = {
      id: 0,
      username: data.username,
      email: data.email,
      password: data.password,
      favorites: []
    };

    const result = await registerUser(newUser);

    if (result.success) {
      Alert.alert(
        i18n.common.success,
        i18n.signUpScreen.registrationSuccess,
        [
          {
            text: i18n.common.ok,
            onPress: () => navigation.dispatch(StackActions.replace('Login')),
          },
        ]
      );
    } else {
      let error = getStringForKey(result.key);
      setApiError(error);
      Alert.alert(
        i18n.common.error,
        error,
        [
          {
            text: i18n.common.ok,
            onPress: () => reset(),
          },
        ]
      );
    }
  }, [registerUser, i18n, navigation, reset]);

  return (
    <SafeAreaView style={theme.commonStyles.safeArea}>
      <View style={theme.commonStyles.container}>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={theme.commonStyles.keyboardAvoidingView}
        >
          <View style={styles.contentContainer}>
            <Image source={icon} style={theme.commonStyles.logoRegular} />

            <Text style={styles.appName}>{i18n.common.appName}</Text>

            <Controller
              control={control}
              name="username"
              rules={{
                required: i18n.common.usernameEmptyError,
                maxLength: {
                  value: 12,
                  message: i18n.signUpScreen.usernameLengthError,
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  placeholder={i18n.common.usernamePlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.username?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: i18n.signUpScreen.emailEmptyError,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: i18n.signUpScreen.emailInvalidError,
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  placeholder={i18n.signUpScreen.emailPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.email?.message}
                  keyboardType="email-address"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: i18n.common.passwordEmptyError,
                minLength: {
                  value: 4,
                  message: i18n.signUpScreen.passwordInvalidError,
                },
                maxLength: {
                  value: 24,
                  message: i18n.signUpScreen.passwordInvalidError,
                },
                pattern: {
                  value: /(?=.*[a-zA-Z])(?=.*\d)/,
                  message: i18n.signUpScreen.passwordInvalidError,
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  placeholder={i18n.signUpScreen.passwordPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.password?.message}
                  secureTextEntry={true}
                />
              )}
            />

            <Controller
              control={control}
              name="reEnterPassword"
              rules={{
                required: i18n.common.passwordEmptyError,
                validate: (value, formValues) =>
                  value === formValues.password || i18n.signUpScreen.passwordMismatchError,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  placeholder={i18n.signUpScreen.reEnterPasswordPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.reEnterPassword?.message}
                  secureTextEntry={true}
                />
              )}
            />

            {apiError ? <Text style={styles.apiErrorText}>{apiError}</Text> : null}

            <CustomButton
              title={i18n.common.registerButton}
              disabled={!isValid}
              onPress={handleSubmit(onFormSubmit)}
              type="primary"
              style={styles.buttonSpacing}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    ...theme.typography.fontStyles.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
  },
  apiErrorText: {
    ...theme.typography.fontStyles.light,
    color: theme.colors.error,
    marginTop: theme.spacing.s,
    textAlign: 'center',
  },
  buttonSpacing: {
    marginTop: theme.spacing.m,
  },
});

export default SignUpScreen;
