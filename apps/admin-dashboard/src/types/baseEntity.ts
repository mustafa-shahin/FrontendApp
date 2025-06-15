export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdById: number | null;
  updatedById: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedById: number | null;
}
