import { useState, useEffect, useCallback } from 'react';
import useApi from '../hooks/useApi';
import { useFavorites } from '../hooks/useFavorites';

export const useHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { events, isLoading, isRefreshing, hasError, loadMoreEvents, refreshEvents } = useApi(searchQuery);

  const { favorites, toggleFavorite } = useFavorites();

  return {
    searchQuery,
    setSearchQuery,
    events,
    isLoading,
    isRefreshing,
    hasError,
    loadMoreEvents,
    refreshEvents,
    favorites,
    toggleFavorite
  };
};
