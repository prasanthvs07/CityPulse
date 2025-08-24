import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp, StackNavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../hooks/useFavorites';
import RootStackParamList from '../navigation/NavigationParams';
import MapViewComponent from '../components/MapView';
import { TransformedEvent } from '../services/apiModels';

type EventDetailsRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;
type EventDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'EventDetails'>;

const EventDetailsScreen = () => {
  const { language, i18n } = useLanguage();
  const isRTL = language === 'ar';
  const { event } = useRoute<EventDetailsRouteProp>().params;
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const isLocationValid = event.venueLat && event.venueLong;
  const textAlignStyle = isRTL ? { textAlign: 'right' } : { textAlign: 'left' };
  const textAligReverse = isRTL ? { textAlign: 'left' } : { textAlign: 'right' };


  return (
    <SafeAreaView style={theme.commonStyles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={[styles.imageContainer, isRTL && { flexDirection: 'row-reverse' }]}>
          {event.imageUrl ? (
            <Image source={{ uri: event.imageUrl }} style={styles.bannerImage} />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
          <TouchableOpacity
            onPress={() => toggleFavorite(event.id)}
            style={[
              styles.favoriteIcon,
              isRTL ? { left: theme.spacing.m, right: undefined } : {}
            ]}
          >
            <Text style={{ fontSize: 40 }}>
              {isFavorite(event.id) ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          
          <View style={[styles.dateVenueContainer, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.dateContainer, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={[styles.dateText, textAlignStyle]}>{i18n.eventDetailsScreen.date}</Text>
              <Text style={[styles.dateText, textAlignStyle]}>{event.date}</Text>
            </View>
            <View style={[styles.venueContainer, isRTL && { alignItems: 'flex-start' }]}>
              <Text style={[styles.venueTitle, textAligReverse]}>{i18n.eventDetailsScreen.venue}</Text>
              <Text style={[styles.venueAddress, textAligReverse]}>{event.venueName}</Text>
              <Text style={[styles.venueAddress, textAligReverse]}>{event.venueCity}</Text>
            </View>
          </View>

          <Text style={[styles.title, textAlignStyle]}>{event.title}</Text>
          {event.fullDescription && (
            <Text style={[styles.description, textAlignStyle]}>
              {event.fullDescription}
            </Text>
          )}

          {isLocationValid && (
            <MapViewComponent
              latitude={event.venueLat}
              longitude={event.venueLong}
              title={i18n.eventDetailsScreen.venue}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
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
  backgroundColor: theme.colors.transparentBg,
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
