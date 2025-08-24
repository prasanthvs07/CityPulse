import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import openMap from 'react-native-open-maps';
import { theme } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext'; 
import EventDetailsScreen from '../screens/EventDetailsScreen';

interface MapViewProps {
  latitude: number | string;
  longitude: number | string;
  title: string;
}

const MapViewComponent: React.FC<MapViewProps> = ({ latitude, longitude, title }) => {
  const { language, i18n } = useLanguage();
  const isRTL = language === 'ar';
  const textAlignStyle = isRTL ? { textAlign: 'right' } : { textAlign: 'left' };

  const parsedLatitude = parseFloat(String(latitude));
  const parsedLongitude = parseFloat(String(longitude));
  const coordinate = { latitude: parsedLatitude, longitude: parsedLongitude };

  if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
    console.error('Invalid latitude or longitude');
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, textAlignStyle]}>
          {i18n.eventDetailsScreen.invalidLocationData}
        </Text>
      </View>
    );
  }

  const handleOpenMap = () => {
    openMap({
      parsedLatitude,
      parsedLongitude,
      query: title,
    });
  };

  return (
    <View style={[styles.container, isRTL && { flexDirection: 'row-reverse' }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.mapTitle, textAlignStyle]}>
          {i18n.eventDetailsScreen.locationOnMap}
        </Text>
        <TouchableOpacity onPress={handleOpenMap} style={styles.mapTouchArea}>
          <MapView
            style={styles.map}
            initialRegion={{
              ...coordinate,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker coordinate={coordinate} title={title} />
          </MapView>
        </TouchableOpacity>
        <Text style={[styles.tapPrompt, textAlignStyle]}>
          {i18n.eventDetailsScreen.tapToOpenInMaps}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.m,
  },
  mapTitle: {
    ...theme.typography.fontStyles.body,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
  },
  mapTouchArea: {
    height: 200,
    borderRadius: theme.spacing.xs,
    overflow: 'hidden',
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  tapPrompt: {
    ...theme.typography.fontStyles.light,
    textAlign: 'center',
    marginTop: theme.spacing.s,
    color: theme.colors.secondary,
  },
   errorText: {
    ...theme.typography.fontStyles.body,
    color: theme.colors.error,
    textAlign: 'center',
  },
});

export default MapViewComponent;
