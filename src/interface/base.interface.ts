/**
 * Base model interface that all other interfaces extend
 */
export interface BaseModel {
  id: string;
  created_at: Date;
  updated_at: Date;
}
