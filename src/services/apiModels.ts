export interface RawImage {
  ratio: string;
  url: string;
  width: number;
  height: number;
  fallback: boolean;
}

export interface RawDate {
  start: {
    localDate: string;
    localTime: string;
    dateTime: string;
  };
}

export interface RawVenue {
  name: string;
  city: { name: string };
  state: { name: string };
}

export interface RawEvent {
  id: string;
  name: string;
  images: RawImage[];
  dates: RawDate;
  info?: string;
  pleaseNote?: string;
  _embedded?: {
    venues: RawVenue[];
  };
}

export interface ApiResponse {
  _embedded?: {
    events: RawEvent[];
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface TransformedEvent {
  id: string;
  title: string;
  imageUrl: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
  venueName: string;
  venueCity: string;
}
