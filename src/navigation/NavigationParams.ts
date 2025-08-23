import { TransformedEvent } from '../services/apiModels';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
  EventDetails: { event: TransformedEvent };
};
