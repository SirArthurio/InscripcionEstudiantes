export type MetadataType = {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
};

export interface PaginatedData<T> {
  page: T;
  metadata?: MetadataType;
}
