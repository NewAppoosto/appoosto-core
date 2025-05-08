import { ServerContext } from "../types";

const isProduction = process.env.NODE_ENV === "production";

export const addTokenToCookie = (
  ctx: ServerContext,
  token: string,
  expiresIn: string
) => {
  ctx.req?.res?.setHeader(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; ${
      isProduction
        ? "Domain=.appoosto.io; Secure; SameSite=None"
        : "SameSite=Lax"
    }; Max-Age=${expiresIn}`
  );
};

export const removeTokenFromCookie = (ctx: ServerContext) => {
  ctx.req?.res?.setHeader("Set-Cookie", `token=; HttpOnly; Path=/; Max-Age=0`);
};

export const addCookie = (
  ctx: ServerContext,
  name: string,
  value: string,
  expiresIn: string
) => {
  ctx.req?.res?.setHeader(
    "Set-Cookie",
    `${name}=${value}; HttpOnly; Path=/; Max-Age=${expiresIn}`
  );
};

export const removeCookie = (ctx: ServerContext, name: string) => {
  ctx.req?.res?.setHeader(
    "Set-Cookie",
    `${name}=; HttpOnly; Path=/; Max-Age=0`
  );
};
