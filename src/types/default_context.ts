import { Request, Response } from "express";
import { JWTUser } from "./jwt_data";

export type ServerContext = {
  authorization: string;
  req: Request & { res?: Response };
  user: JWTUser;
};
