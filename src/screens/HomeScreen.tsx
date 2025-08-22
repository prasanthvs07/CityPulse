import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  I18nManager,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, StackNavigationProp, useIsFocused } from '@react-navigation/native';
import { useStorage } from '../hooks/useStorage';
import { useLanguage } from '../context/LanguageContext';
import useApi from '../hooks/useApi';
import EventCardView from '../components/EventCardView';
import { TransformedEvent } from '../services/apiModels';
import { theme } from '../theme/theme';
import RootStackParamList from '../navigation/NavigationParams';

type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<HomeRouteProp>();
  const isFocused = useIsFocused();
  const { i18n } = useLanguage();

  const { getUserData, updateUserData } = useStorage();

  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const username = route.params?.username || 'Guest';

  const { events, isLoading, isRefreshing, hasError, loadMoreEvents, refreshEvents } = useApi(searchQuery);

  const isRTL = I18nManager.isRTL;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerLeft: () => null,
      headerTitle: () => (
        <View style={[
          styles.headerTitleContainer,
          isRTL && { flexDirection: 'row-reverse' }
        ]}>
          <Text style={styles.headerWelcome}>{i18n.homeScreeen.welcomeMessage}</Text>
          <Text style={styles.headerUsername}>{username}</Text>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { username: loggedInUser?.username || 'Guest' })}>
          <Image
            source={require('../../assets/profilePlaceholder.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, username, loggedInUser, i18n, isRTL]);

  const fetchUserAndFavorites = useCallback(async () => {
    if (username !== 'Guest') {
      const userData = await getUserData(username);
      if (userData) {
        setLoggedInUser(userData);
        setFavorites(userData.favorites || []);
      }
    } else {
      setLoggedInUser(null);
      setFavorites([]);
    }
  }, [username, getUserData]);

  useEffect(() => {
    if (isFocused) {
      fetchUserAndFavorites();
    }
  }, [isFocused, fetchUserAndFavorites]);

  const toggleFavorite = async (eventId: string) => {
    if (!loggedInUser) {
      Alert.alert(i18n.homeScreeen.loginToSaveFavorites);
      return;
    }

    const isCurrentlyFavorite = favorites.includes(eventId);
    const updatedFavorites = isCurrentlyFavorite
      ? favorites.filter((id) => id !== eventId)
      : [...favorites, eventId];

    setFavorites(updatedFavorites);

    try {
      await updateUserData(loggedInUser.username, { favorites: updatedFavorites });
    } catch (error) {
      setFavorites(favorites);
      Alert.alert('Error', 'Failed to save favorite. Please try again.');
    }
  };

  const renderContent = () => {
    if (isLoading && events.length === 0) {
      return (
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }
    if (hasError || events.length === 0) {
      return (
        <View style={styles.centeredContent}>
          <Text style={styles.emptyText}>{i18n.homeScreeen.noEventsFound}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventCardView
            event={item}
            isFavorite={favorites.includes(item.id)}
            onPress={() => navigation.navigate('EventDetails', { event: item, username: username })}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshEvents} />
        }
      />
    );
  };

  return (
    <SafeAreaView style={theme.commonStyles.safeArea}>
      <View style={styles.contentContainer}>
        <TextInput
          style={[styles.searchBar, isRTL && { textAlign: 'right' }]}
          placeholder={i18n.homeScreeen.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerWelcome: {
    ...theme.typography.fontStyles.light,
  },
  headerUsername: {
    ...theme.typography.fontStyles.body,
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: theme.spacing.m,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
  },
  searchBar: {
    height: 40,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    color: theme.colors.primary,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.fontStyles.body,
    textAlign: 'center',
  },
  flatListContainer: {
    paddingBottom: theme.spacing.l,
  },
});

export default HomeScreen;
