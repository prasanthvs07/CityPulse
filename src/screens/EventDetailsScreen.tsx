  import React, { useState, useEffect, useCallback } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    I18nManager,
    Alert,
    ScrollView,
  } from 'react-native';
  import { useRoute, useNavigation, RouteProp, StackNavigationProp } from '@react-navigation/native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { theme } from '../theme/theme';
  import { useStorage } from '../hooks/useStorage';
  import { useLanguage } from '../context/LanguageContext';
  import { TransformedEvent } from '../services/apiModels';
  import RootStackParamList from '../navigation/NavigationParams';

  type EventDetailsRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;
  type EventDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'EventDetails'>;

  const EventDetailsScreen = () => {
    const navigation = useNavigation<EventDetailsNavigationProp>();
    const route = useRoute<EventDetailsRouteProp>();
    const { event } = route.params;
    const { i18n } = useLanguage();
    const { getUserData, updateUserData } = useStorage();

    const [favorites, setFavorites] = useState<string[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<any | null>(null);

    const username = route.params?.username || 'Guest';
    const isRTL = I18nManager.isRTL;

    const fetchUserAndFavorites = useCallback(async () => {
      if (username !== 'Guest') {
        const userData = await getUserData(username);
        if (userData) {
          setLoggedInUser(userData);
          setFavorites(userData.favorites || []);
        }
      }
    }, [username, getUserData]);

    useEffect(() => {
      fetchUserAndFavorites();
    }, [fetchUserAndFavorites]);

    const toggleFavorite = async () => {
      if (!loggedInUser) {
        Alert.alert(i18n.common.pleaseLogin);
        return;
      }

      const isCurrentlyFavorite = favorites.includes(event.id);
      const updatedFavorites = isCurrentlyFavorite
        ? favorites.filter((id) => id !== event.id)
        : [...favorites, event.id];

      setFavorites(updatedFavorites);

      try {
        await updateUserData(loggedInUser.username, { favorites: updatedFavorites });
      } catch (error) {
        setFavorites(favorites);
        Alert.alert('Error', 'Failed to save favorite. Please try again.');
      }
    };

    const isFavorite = favorites.includes(event.id);

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.imageContainer}>
            {event.imageUrl ? (
              <Image source={{ uri: event.imageUrl }} style={styles.bannerImage} />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteIcon}>
              <Text style={{ fontSize: 40 }}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <View style={[styles.dateVenueContainer, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.dateContainer, isRTL && { alignItems: 'flex-end' }]}>
                <Text style={styles.dateText}>{i18n.eventDetailsScreen.date}</Text>
                <Text style={styles.dateText}>{event.date}</Text>
              </View>
              <View style={[styles.venueContainer, isRTL && { alignItems: 'flex-end' }]}>
                <Text style={styles.venueTitle}>{i18n.eventDetailsScreen.venue}</Text>
                <Text style={styles.venueAddress}>{event.venueName}</Text>
                <Text style={styles.venueAddress}>{event.venueCity}</Text>
              </View>
            </View>
            <Text style={[styles.title, isRTL && { textAlign: 'right' }]}>{event.title}</Text>
            {event.fullDescription && (
              <Text style={[styles.description, isRTL && { textAlign: 'right' }]}>{event.fullDescription}</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: theme.spacing.m,
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      position: 'relative',
    },
    bannerImage: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.border,
    },
    favoriteIcon: {
      position: 'absolute',
      bottom: theme.spacing.m,
      right: theme.spacing.m,
      padding: theme.spacing.s,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderRadius: 20,
    },
    contentContainer: {
      padding: theme.spacing.m,
    },
    dateVenueContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: theme.spacing.m,
    },
    dateContainer: {
      flex: 1,
      alignItems: 'flex-start',
    },
    dateText: {
      ...theme.typography.fontStyles.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    venueContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    venueTitle: {
      ...theme.typography.fontStyles.body,
    },
    venueAddress: {
      ...theme.typography.fontStyles.body,
      color: theme.colors.textSecondary,
      textAlign: 'right',
    },
    title: {
      ...theme.typography.fontStyles.h2,
      marginBottom: theme.spacing.s,
      textAlign: 'left',
    },
    description: {
      ...theme.typography.fontStyles.body,
      textAlign: 'left',
    },
  });

  export default EventDetailsScreen;
