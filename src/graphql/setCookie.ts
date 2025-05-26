import { ServerContext } from "../types";

const isProduction = process.env.NODE_ENV === "production";

export const addTokenToCookie = (
  ctx: ServerContext,
  token: string,
  expiresIn: string
) => {
  const accessTokenCookie = `access_token=${token}; HttpOnly; Path=/; ${
    isProduction ? "Domain=.appoosto.io; Secure; SameSite=None" : "SameSite=Lax"
  }; Max-Age=${expiresIn}`;

  const isAuthenticatedCookie = `is_Authenticated=true; Path=/; ${
    isProduction ? "Domain=.appoosto.io; Secure; SameSite=None" : "SameSite=Lax"
  }; Max-Age=${expiresIn}`;

  // Get existing cookies if any and ensure we're working with strings
  const existingCookies = ctx.req?.res?.getHeader("Set-Cookie");
  const cookiesArray: string[] = [];

  // Add existing cookies if any
  if (existingCookies) {
    if (Array.isArray(existingCookies)) {
      cookiesArray.push(...existingCookies.map(String));
    } else {
      cookiesArray.push(String(existingCookies));
    }
  }

  // Add our new cookies
  cookiesArray.push(accessTokenCookie, isAuthenticatedCookie);

  // Set all cookies at once
  ctx.req?.res?.setHeader("Set-Cookie", cookiesArray);
};

export const removeTokenFromCookie = (ctx: ServerContext) => {
  ctx.req?.res?.setHeader("Set-Cookie", [
    `access_token=; HttpOnly; Path=/; ${
      isProduction
        ? "Domain=.appoosto.io; Secure; SameSite=None"
        : "SameSite=Lax"
    }; Max-Age=0`,
    `is_Authenticated=; Path=/; ${
      isProduction
        ? "Domain=.appoosto.io; Secure; SameSite=None"
        : "SameSite=Lax"
    }; Max-Age=0`,
  ]);
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
