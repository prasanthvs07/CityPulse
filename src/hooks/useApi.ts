import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { TransformedEvent } from '../services/apiModels';

const useApi = (searchQuery: string) => {
  const [events, setEvents] = useState<TransformedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchEvents = useCallback(async (query: string, page: number, isInitialLoad = true) => {
    if (isInitialLoad) {
      setIsLoading(true);
    }
    setHasError(false);
    try {
      const fetchedEvents = await apiService.getEvents({
        keyword: query,
        page: page,
        size: 20,
      });
      if (page === 0) {
        setEvents(fetchedEvents);
      } else {
        setEvents(prevEvents => [...prevEvents, ...fetchedEvents]);
      }
    } catch (error) {
      setHasError(true);
      if (page === 0) {
        setEvents([]);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(0);
    fetchEvents(searchQuery, 0);
  }, [searchQuery, fetchEvents]);

  const loadMoreEvents = () => {
    if (!isLoading && !isRefreshing) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchEvents(searchQuery, nextPage, false);
    }
  };

  const refreshEvents = () => {
    setIsRefreshing(true);
    setCurrentPage(0);
    fetchEvents(searchQuery, 0);
  };

  return {
    events,
    isLoading,
    isRefreshing,
    hasError,
    loadMoreEvents,
    refreshEvents,
  };
};

export default useApi;
