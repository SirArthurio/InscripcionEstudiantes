import { person } from '../person.type';

export type professor = person & {
  specialty: string;
  user: {
    institutionalEmail: string;
    password: string;
  };
};
