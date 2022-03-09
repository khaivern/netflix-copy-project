import { NextApiRequest, NextApiResponse } from "next";
import { removeTokenCookie, verifyTokenCookie } from "../../lib/cookies";
import { magicAdmin } from "../../lib/magic";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ error: "User is not logged in" });
    }
    const token = req.cookies.token;

    const userId = verifyTokenCookie(token);
    removeTokenCookie(res);

    try {
      await magicAdmin.users.logoutByIssuer(userId);
    } catch (err) {
      console.error("Error occurred while logging out magic user", err);
    }
    return res.writeHead(402, { location: "/login" }).end();
  } catch (err) {
    return res.status(401).json({ error: "user is not logged in" });
  }
}

export default handler;
