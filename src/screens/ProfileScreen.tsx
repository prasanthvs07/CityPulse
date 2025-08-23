import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { DesignConstants } from '../theme/designConstants';
import { useProfile } from '../hooks/useProfile';
import { useNavigation, useRoute, RouteProp, StackNavigationProp } from '@react-navigation/native';

type ProfileNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const { currentUser, handleLogout, handleDeleteAccount } = useProfile();
  const userName = currentUser?.username?.toLowerCase() || '';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
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
        <Text style={styles.username}>{currentUser?.username || 'Guest'}</Text>

        <View style={styles.emailContainer}>
          <Text style={styles.emailTitle}>Email</Text>
          <View style={styles.emailField}>
            <Text style={styles.emailText}>{currentUser?.email || 'N/A'}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={[styles.deleteButton, userName === 'guest' && styles.disabledButton]}
          disabled={userName === 'guest'}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
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
