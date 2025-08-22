import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  I18nManager,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme/theme';
import { DesignConstants } from '../theme/designConstants';
import { TransformedEvent } from '../services/apiModels';

interface EventCardViewProps {
  event: TransformedEvent;
  onPress: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  style?: ViewStyle;
}

const EventCardView: React.FC<EventCardViewProps> = ({
  event,
  onPress,
  onToggleFavorite,
  isFavorite,
  style,
}) => {
  const isRTL = I18nManager.isRTL;

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        style,
        isRTL && { flexDirection: 'row-reverse' }, 
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      
      <Image
        source={{ uri: event.imageUrl }}
        style={[styles.eventImage, isRTL && styles.rtlImageMargin]}
        onError={(e) => console.error('Image loading error:', e.nativeEvent.error)}
      />

      <View style={styles.textContainer}>
        <Text
          style={[styles.title, isRTL && { textAlign: 'right' }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {event.title}
        </Text>
        <Text
          style={[styles.description, isRTL && { textAlign: 'right' }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {event.date}
        </Text>
      </View>

      <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteIcon}>
        <Text style={{ fontSize: 24 }}>{isFavorite ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    ...theme.commonStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    padding: theme.spacing.s,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: DesignConstants.BORDER_RADIUS,
    marginRight: theme.spacing.m,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.fontStyles.body,
    // fontSize: theme.typography.fontStyles.body.fontSize,
  },
  description: {
    ...theme.typography.fontStyles.light,
    marginTop: theme.spacing.xs,
  },
  favoriteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.m,
  },
  rtlImageMargin: {
    marginRight: 0,
    marginLeft: theme.spacing.m,
  },
});

export default EventCardView;
