import { PaginatedData } from './data-pagination.interface';

export interface ContentResponse<T = any> {
  status: boolean;
  statusCode: number;
  data: T;
  message?: string;
}
export type ContentResponsePaginated<T> = {
  status: boolean;
  statusCode: number;
  data: PaginatedData<T>;
  message?: string;
};

export interface MessageResponse {
  message: string;
}
