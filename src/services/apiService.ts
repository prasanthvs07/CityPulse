import { apiClient } from './apiClient';
import { ApiResponse, TransformedEvent, RawEvent } from './apiModels';

export const endPoints = {
  getEvents: '/discovery/v2/events',
};

const apiService = {
  getEvents: async (params: { keyword?: string; size?: number; page?: number } = {}): Promise<TransformedEvent[]> => {
    try {
      const response = await apiClient.get<ApiResponse>(endPoints.getEvents, params);
      const rawEvents = response._embedded?.events || [];
      const transformedEvents: TransformedEvent[] = rawEvents.map(rawEvent => ({
        id: rawEvent.id,
        title: rawEvent.name,
        imageUrl: rawEvent.images?.[0]?.url || '',
        shortDescription: rawEvent.pleaseNote || '',
        fullDescription: rawEvent.info || '',
        date: rawEvent.dates?.start?.localDate || '',
        venueName: rawEvent._embedded?.venues?.[0]?.name || '',
        venueCity: rawEvent._embedded?.venues?.[0]?.city?.name || '',
      }));
      return transformedEvents;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;