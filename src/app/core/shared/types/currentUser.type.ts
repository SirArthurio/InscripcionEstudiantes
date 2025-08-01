import { UserTypes } from '../enums/user-types.enum';
import { user } from './user.type';
import { userInfo } from './userInfo.type';
import { student } from './users/estudiante.type';
import { superadmin } from './users/superadmin.tye';

export type currentUser = {
  user: user | null;
  student: student | null;
  superadmin: superadmin | null;
};
export type UserRole = {
  student: student;
  superadmin: superadmin;
};
