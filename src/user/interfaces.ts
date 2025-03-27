/**
 * User interface
 */

import { JWTUser } from "../types";

/**
 * User details interface
 */
export interface IUserDetails {
  id: string;
  username: string;
  email: string;
}

/**
 * Company details interface
 */
export interface ICompanyDetails  {
  id: string;
  name: string;
  legal_address: string;
  vat_number: string;
}

export interface RequestWithUser extends Request {
  user: JWTUser;
}