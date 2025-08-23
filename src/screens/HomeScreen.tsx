import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, StackNavigationProp, useFocusEffect} from '@react-navigation/native';
import { theme } from '../theme/theme';
import EventCardView from '../components/EventCardView';
import { useLanguage } from '../context/LanguageContext';
import { useHome } from '../hooks/useHome';
import RootStackParamList from '../navigation/NavigationParams';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';

type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<HomeRouteProp>();
  const { currentUser, refreshCurrentUser } = useAuth();

  const { language, i18n } = useLanguage();
  const isRTL = language === 'ar';

  const username = currentUser?.username || 'Guest';

  const {
    searchQuery,
    setSearchQuery,
    events,
    isLoading,
    isRefreshing,
    hasError,
    loadMoreEvents,
    refreshEvents,
  } = useHome();

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerLeft: () => null,
      headerTitle: () => (
        <View
          style={[
            styles.headerTitleContainer,
            isRTL && { flexDirection: 'row-reverse' },
          ]}
        >
          <Text style={styles.headerWelcome}>
            {i18n.homeScreeen.welcomeMessage}
          </Text>
          <Text style={styles.headerUsername}>{username}</Text>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../../assets/profilePlaceholder.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, username, i18n, isRTL]);

  useFocusEffect(
    React.useCallback(() => {
      refreshCurrentUser();
    }, [refreshCurrentUser])
  );

  return (
    <SafeAreaView style={theme.commonStyles.safeArea}>
      <View style={styles.contentContainer}>
        <TextInput
          style={[styles.searchBar, isRTL && { textAlign: 'right' }]}
          placeholder={i18n.homeScreeen.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {isLoading && events.length === 0 ? (
          <View style={styles.centeredContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : hasError || events.length === 0 ? (
          <View style={styles.centeredContent}>
            <Text style={styles.emptyText}>
              {i18n.homeScreeen.noEventsFound}
            </Text>
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({ item }) => (
              <EventCardView
                event={item}
                //isFavorite={favorites.includes(item.id)}
                isFavorite = {isFavorite(item.id)}
                onPress={() =>
                  navigation.navigate('EventDetails', { event: item, username })
                }
                onToggleFavorite={() => toggleFavorite(item.id)}
              />
            )}
            onEndReached={loadMoreEvents}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={refreshEvents} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
    paddingTop: 0,
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
    paddingTop: 0,
  },
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
});

export default HomeScreen;
