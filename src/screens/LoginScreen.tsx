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
import { theme } from '../theme/theme';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import LanguageSelector from '../components/LanguageSelector';
import { useStorage } from '../hooks/useStorage';
import { useLanguage } from '../context/LanguageContext';
import icon from '../../assets/splash-icon.png';
import { useNavigation, StackActions } from '@react-navigation/native';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const [apiError, setApiError] = useState('');
  const { authenticateUser } = useStorage();
  const navigation = useNavigation();
  const { i18n } = useLanguage();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onFormSubmit = async (data: LoginFormData) => {
    try {
      const result = await authenticateUser(data.username, data.password);

      if (result.success && result.user) {
        navigation.dispatch(StackActions.replace('Home', { username: result.user.username }));
      }
    } catch (error) {
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleGuestLogin = () => {
    navigation.dispatch(StackActions.replace('Home', { username: 'Guest' }));
  };

  return (
    <SafeAreaView style={theme.commonStyles.safeArea}>
      <View style={theme.commonStyles.container}>
        <View style={styles.languageSelectorContainer}>
          <LanguageSelector />
        </View>
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
              name="password"
              rules={{
                required: i18n.common.passwordEmptyError,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  placeholder={i18n.common.passwordPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={true}
                  errorMessage={errors.password?.message}
                />
              )}
            />
            {apiError ? <Text style={styles.apiErrorText}>{apiError}</Text> : null}
            <CustomButton
              title={i18n.loginScreen.loginButton}
              onPress={handleSubmit(onFormSubmit)}
              type="primary"
              style={styles.buttonSpacing}
            />
            <CustomButton
              title={i18n.loginScreen.signUpButton}
              onPress={handleSignUp}
              type="secondary"
              style={styles.buttonSpacing}
            />
            <CustomButton
              title={i18n.loginScreen.guestLoginButton}
              onPress={handleGuestLogin}
              type="tertiary"
              style={styles.buttonSpacing}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  languageSelectorContainer: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.m,
  },
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

export default LoginScreen;
