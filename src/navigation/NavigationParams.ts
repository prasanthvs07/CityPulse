import { TransformedEvent } from '../services/apiModels';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: { username?: string };
  Profile: { username: string };
  EventDetails: { event: TransformedEvent, username: string };
};