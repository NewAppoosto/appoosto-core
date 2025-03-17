import { BaseModel } from "../interface/base.interface";

/**
 * User Profile interface
 */
export interface IUserProfile extends BaseModel {
  user_id: string;
  first_name: string;
  last_name: string;
  profile_photo?: string;
  cover_photo?: string;
  phone_number?: string;
}
