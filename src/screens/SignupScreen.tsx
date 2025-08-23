import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { theme } from '../theme/theme';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import icon from '../../assets/splash-icon.png';
import { useSignUp } from '../hooks/useSignUp';
import { useLanguage } from '../context/LanguageContext';

const SignUpScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    onFormSubmit,
    errors,
    isValid,
    apiError,
  } = useSignUp();
  const { i18n } = useLanguage()

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
                maxLength: { value: 12, message: i18n.signUpScreen.usernameLengthError },
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
                pattern: { value: /\S+@\S+\.\S+/, message: i18n.signUpScreen.emailInvalidError },
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
                minLength: { value: 4, message: i18n.signUpScreen.passwordInvalidError },
                maxLength: { value: 24, message: i18n.signUpScreen.passwordInvalidError },
                pattern: { value: /(?=.*[a-zA-Z])(?=.*\d)/, message: i18n.signUpScreen.passwordInvalidError },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextInput
                  placeholder={i18n.signUpScreen.passwordPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.password?.message}
                  secureTextEntry
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
                  secureTextEntry
                />
              )}
            />

            { apiError ? 
              (<Text style={ styles.apiErrorText }>
                 { i18n.common[apiError] || i18n.common.genericError }
              </Text> 
              ): null
            }

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
