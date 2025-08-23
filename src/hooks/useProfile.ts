import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useStorage } from '../hooks/useStorage';
import { useLanguage } from '../context/LanguageContext';

export const useProfile = () => {
  const navigation = useNavigation();
  const { i18n } = useLanguage();
  const { currentUser, logout } = useAuth();
  const { deleteUser } = useStorage();

  const handleLogout = useCallback(() => {
    Alert.alert(
      i18n.profileScreen.logout,
      i18n.profileScreen.logoutConfirmation,
      [
        { text: i18n.common.cancel, style: 'cancel' },
        {
          text: i18n.profileScreen.logout,
          onPress: async () => {
            await logout();
            navigation.dispatch(StackActions.replace('Login'));
          },
        },
      ],
      { cancelable: false }
    );
  }, [logout, navigation, i18n]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      i18n.profileScreen.deleteAccount,
      i18n.profileScreen.deleteAccountConfirmation,
      [
        { text: i18n.common.cancel, style: 'cancel' },
        {
          text: i18n.profileScreen.delete,
          style: 'destructive',
          onPress: async () => {
            if (currentUser?.username) {
              const success = await deleteUser(currentUser.username);
              if (success) {
                await logout();
                navigation.dispatch(StackActions.replace('Login'));
              } else {
                Alert.alert(i18n.common.error, i18n.common.failedtoDeleteAccount);
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  }, [currentUser, deleteUser, logout, navigation, i18n]);

  return {
    currentUser,
    handleLogout,
    handleDeleteAccount,
  };
};
