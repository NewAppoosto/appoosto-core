import { ServerContext } from "../types";
import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

const getDefaultCookieOptions = (expiresIn: string): CookieOptions => ({
  httpOnly: true,
  path: "/",
  domain: isProduction ? ".appoosto.io" : undefined,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: parseInt(expiresIn, 10),
});

export const addTokenToCookie = (
  ctx: ServerContext,
  token: string,
  expiresIn: string
) => {
  const options = getDefaultCookieOptions(expiresIn);

  // Set access token cookie
  ctx.req?.res?.cookie("access_token", token, options);

  // Set isAuthenticated cookie
  ctx.req?.res?.cookie("is_Authenticated", "true", {
    ...options,
    httpOnly: false, // Allow JavaScript access to this cookie
  });
};

export const removeTokenFromCookie = (ctx: ServerContext) => {
  const options = getDefaultCookieOptions("0");

  ctx.req?.res?.clearCookie("access_token", options);
  ctx.req?.res?.clearCookie("is_Authenticated", {
    ...options,
    httpOnly: false,
  });
};

export const addCookie = (
  ctx: ServerContext,
  name: string,
  value: string,
  expiresIn: string
) => {
  ctx.req?.res?.cookie(name, value, getDefaultCookieOptions(expiresIn));
};

export const removeCookie = (ctx: ServerContext, name: string) => {
  ctx.req?.res?.clearCookie(name, getDefaultCookieOptions("0"));
};
