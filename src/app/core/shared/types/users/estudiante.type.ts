import { person } from '../person.type';

export type student = person & {
  program: string;
  semester: number;
  admissionDate: string;
};
