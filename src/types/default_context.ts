import { Request } from "express";
import { JWTUser } from "./jwt_data";
export type ServerContext = {
  authorization: string;
  req: Request;
  user: JWTUser;
};

