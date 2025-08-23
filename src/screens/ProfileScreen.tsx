import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { DesignConstants } from '../theme/designConstants';
import { useProfile } from '../hooks/useProfile';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation, useRoute, RouteProp, StackNavigationProp } from '@react-navigation/native';

type ProfileNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const { currentUser, handleLogout, handleDeleteAccount } = useProfile();
  const userName = currentUser?.username?.toLowerCase() || '';
  const { language, i18n } = useLanguage();
  
  const isRTL = language === 'ar'
  const textDirectionStyle = isRTL ? { textAlign: 'right' } : {};
  const containerDirectionStyle = isRTL ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>{i18n.profileScreen.logout}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleLogout]);

  return (
    <SafeAreaView style={theme.commonStyles.safeArea}>z
      <View style={styles.contentContainer}>
        <Image
          source={require('../../assets/profilePlaceholder.png')}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{currentUser?.username || 'Guest'}</Text>

        <View style={[styles.emailContainer, containerDirectionStyle]}>
          <Text style={[styles.emailTitle, textDirectionStyle]}>{i18n.signUpScreen.emailPlaceholder}</Text>
          <View style={styles.emailField}>
            <Text style={[styles.emailText, textDirectionStyle]}>{currentUser?.email || 'N/A'}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={[styles.deleteButton, userName === 'guest' && styles.disabledButton]}
          disabled={userName === 'guest'}
        >
          <Text style={styles.deleteButtonText}>{i18n.profileScreen.deleteAccount}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.xl,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: DesignConstants.LOGO_SMALL_WIDTH,
    marginBottom: theme.spacing.m, 
    borderColor: theme.colors.border,
    borderWidth: 2,
  },
  username: {
    ...theme.typography.fontStyles.h2,
    marginBottom: theme.spacing.xl,
    color: theme.colors.text,
  },
  emailContainer: {
    width: '100%',
    marginBottom: theme.spacing.m,
  },
  emailTitle: {
    ...theme.typography.fontStyles.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs, 
  },
  emailField: {
    width: '100%',
    padding: theme.spacing.m,
    borderColor: theme.colors.border,
    borderWidth: DesignConstants.BORDER_WIDTH,
    borderRadius: DesignConstants.BORDER_RADIUS,
    backgroundColor: theme.colors.surface,
  },
  emailText: {
    ...theme.typography.fontStyles.body,
    color: theme.colors.text,
  },
  deleteButton: {
    marginTop: theme.spacing.m,
    padding: theme.spacing.m, 
    backgroundColor: theme.colors.error,
    borderRadius: DesignConstants.BORDER_RADIUS,
    width: '100%',
    alignItems: 'center',
  },
  deleteButtonText: {
    ...theme.typography.fontStyles.body,
    color: theme.colors.surface,
    fontWeight: theme.typography.fontStyles.body.fontWeight,
    fontSize: theme.typography.fontStyles.body.fontSize,
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
  logoutButton: {
    paddingHorizontal: 15,
  },
  logoutButtonText: {
    ...theme.typography.fontStyles.body,
    color: theme.colors.error,
  },
});


export default ProfileScreen;
