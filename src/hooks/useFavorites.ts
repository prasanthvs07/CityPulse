import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';


export const useFavorites = () => {
  const { currentUser, toggleFavoriteInAuth } = useAuth();
  const favorites = currentUser?.favorites || [];

  const toggleFavorite = (eventId: string) => {
    if (!currentUser || currentUser.username === 'guest') {
      Alert.alert('Sorry', 'Please login to save favorites.');
      return;
    }
    toggleFavoriteInAuth(eventId);
  };

  const isFavorite = (eventId: string): boolean => {
    return favorites.includes(eventId);
  };

  return {
    favorites,
    // fetchFavorites,
    toggleFavorite,
    isFavorite,
  };
};

