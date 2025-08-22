import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  I18nManager,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, RouteProp, useRoute, useIsFocused, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/NavigationParams';
import { useStorage } from '../hooks/useStorage';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme/theme';
import { DesignConstants } from '../theme/designConstants';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute<ProfileScreenRouteProp>();
  const isFocused = useIsFocused();
  const { i18n } = useLanguage();
  const { getUserData, deleteUser } = useStorage();

  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);
  const username = route.params?.username || 'Guest';

  const fetchUser = useCallback(async () => {
    if (username !== 'Guest') {
      const userData = await getUserData(username);
      if (userData) {
        setLoggedInUser(userData);
      }
    } else {
      setLoggedInUser(null);
    }
  }, [username, getUserData]);

  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused, fetchUser]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      i18n.profileScreen.logout,
      i18n.profileScreen.logoutConfirmation,
      [
        {
          text: i18n.common.cancel,
          style: 'cancel',
        },
        {
          text: i18n.profileScreen.logout,
          onPress: () => {
            navigation.dispatch(StackActions.replace('Login'));
          },
        },
      ],
      { cancelable: false }
    );
  }, [navigation]);

  const handleDeleteAccount = () => {
    Alert.alert(
      i18n.profileScreen.deleteAccount,
      i18n.profileScreen.deleteAccountConfirmation,
      [
        {
          text: i18n.common.cancel,
          style: 'cancel',
        },
        {
          text: i18n.profileScreen.delete,
          style: 'destructive',
          onPress: async () => {
            if (loggedInUser && loggedInUser.username) {
              const success = await deleteUser(loggedInUser.username);
              if (success) {
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
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutButton, username === 'Guest' && styles.disabledButton]}
          disabled={username === 'Guest'}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleLogout]);

  return (
    <SafeAreaView style={theme.commonStyles.safeArea}>
      <View style={styles.contentContainer}>
        <Image
          source={require('../../assets/profilePlaceholder.png')}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{loggedInUser?.username || 'Guest'}</Text>
        <View style={styles.emailContainer}>
          <Text style={styles.emailTitle}>Email</Text>
          <View style={styles.emailField}>
            <Text style={styles.emailText}>{loggedInUser?.email || 'N/A'}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={[styles.deleteButton, username === 'Guest' && styles.disabledButton]}
          disabled={username === 'Guest'}
        >
          <Text style={styles.deleteButtonText}>{i18n.profileScreen.deleteAccount}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    paddingHorizontal: 15,
  },
  logoutButtonText: {
    ...theme.typography.fontStyles.body,
    color: theme.colors.error,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderColor: theme.colors.border,
    borderWidth: 2,
  },
  username: {
    ...theme.typography.fontStyles.h2,
    marginBottom: 30,
    color: theme.colors.text,
  },
  emailContainer: {
    width: '100%',
    marginBottom: 20,
  },
  emailTitle: {
    ...theme.typography.fontStyles.body,
    color: theme.colors.textSecondary,
    marginBottom: 5,
  },
  emailField: {
    width: '100%',
    padding: 15,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: DesignConstants.BORDER_RADIUS,
    backgroundColor: theme.colors.surface,
  },
  emailText: {
    ...theme.typography.fontStyles.body,
    color: theme.colors.text,
  },
  deleteButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: theme.colors.error,
    borderRadius: DesignConstants.BORDER_RADIUS,
    width: '100%',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
});

export default ProfileScreen;
