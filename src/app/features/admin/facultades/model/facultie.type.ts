import { baseCode } from '@core/shared/types';

export type facultie = baseCode & {
  phoneNumber: string;
  extensions: string;
  address: string;
  email: string;
};
