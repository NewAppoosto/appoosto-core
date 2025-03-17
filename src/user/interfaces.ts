import { BaseModel } from "../interface/base.interface";

/**
 * User interface
 */
export interface IUser extends BaseModel {
  adminId: string;
  isCompany: boolean;
  userDetails?: IUserDetails;
  companyDetails?: ICompanyDetails;
}

/**
 * User details interface
 */
export interface IUserDetails extends BaseModel {
  id: string;
  username: string;
  email: string;
}

/**
 * Company details interface
 */
export interface ICompanyDetails extends BaseModel {
  id: string;
  name: string;
  legal_address: string;
  vat_number: string;
}
