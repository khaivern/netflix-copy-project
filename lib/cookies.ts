import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { GetServerSidePropsContext } from "next";

const MAX_AGE = 7 * 24 * 60 * 60;

export const setTokenCookie = (token: string, res: NextApiResponse) => {
  const setCookie = cookie.serialize("token", token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE),
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.setHeader("Set-Cookie", setCookie);
};

export const removeTokenCookie = (res: NextApiResponse) => {
  const val = cookie.serialize("token", "", {
    maxAge: -1,
    path: "/",
  });
  res.setHeader("Set-Cookie", val);
};

export const verifyTokenCookie = (token: string | null) => {
  const HASURA_JWT_SECRET_KEY = process.env.HASURA_JWT_SECRET_KEY;
  if (!token || !HASURA_JWT_SECRET_KEY) {
    return null;
  }
  const decodedToken = jwt.verify(token, HASURA_JWT_SECRET_KEY) as { issuer: string };
  if (!decodedToken) {
    console.error("Decoded token is not valid");
    return null;
  }
  return decodedToken.issuer;
};

export const verifyTokenAuthentication = (context: GetServerSidePropsContext) => {
  try {
    const token = context.req ? context.req.cookies.token : null;
    if (!token) {
      throw new Error("No token found in cookies");
    }
    const userId = verifyTokenCookie(token);
    if (!userId) {
      throw new Error("Failed to find userId");
    }
    return { token, userId, error: "" };
  } catch (err: any) {
    return { token: "", userId: "", error: err.message };
  }
};
