import { ServerContext } from "../types";

const isProduction = process.env.NODE_ENV === "production";

export const addTokenToCookie = (
  ctx: ServerContext,
  token: string,
  expiresIn: string // must be seconds as string like '3600'
) => {
  const maxAge = parseInt(expiresIn, 10);

  const cookie = [
    `access_token=${token}`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=${maxAge}`,
    isProduction ? `Domain=.appoosto.io` : "",
    isProduction ? `Secure` : "",
    isProduction ? `SameSite=None` : `SameSite=Lax`,
  ]
    .filter(Boolean) // remove empty strings
    .join("; ");

  ctx.req?.res?.setHeader("Set-Cookie", cookie);
};

export const removeTokenFromCookie = (ctx: ServerContext) => {
  ctx.req?.res?.setHeader(
    "Set-Cookie",
    `access_token=; HttpOnly; Path=/; Max-Age=0`
  );

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
