export const AUTH_COOKIE_NAME = "token";
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60;

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
};
