import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';
import { DesignConstants } from '../theme/designConstants';
import { TransformedEvent } from '../services/apiModels';
import { useLanguage } from '../context/LanguageContext';

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
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const textAlignStyle = isRTL ? { textAlign: 'right' } : { textAlign: 'left' };

  return (
  <TouchableOpacity
   style={[styles.cardContainer, isRTL && { flexDirection: 'row-reverse' }]}
   onPress={onPress}
  >
  <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
  <View style={styles.textContainer}>
    <Text style={[styles.title, textAlignStyle]}>{event.title}</Text>
    <Text style={[styles.title, textAlignStyle]}>{event.date}</Text>
  </View>
  <TouchableOpacity onPress={onToggleFavorite}>
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
  cardContainerRTL: {
    flexDirection: 'row-reverse', 
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: DesignConstants.BORDER_RADIUS,
    marginHorizontal: theme.spacing.m / 2, 
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: theme.spacing.m / 2,
  },
  title: {
    ...theme.typography.fontStyles.body,
  },
  description: {
    ...theme.typography.fontStyles.light,
    marginTop: theme.spacing.xs,
  },
  favoriteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.m / 2,
  },
});

export default EventCardView;
