import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { magicAdmin } from "../../lib/magic";
import { checkIfNewUser, createNewUserRecord } from "../../lib/db/hasura";
import { setTokenCookie } from "../../lib/cookies";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Invalid API request" });
  }
  try {
    // extract DIDToken from headers
    const auth = req.headers.authorization;
    const DIDToken = auth ? auth.slice(7) : "";

    // extract the metadata from the token
    const metadata = await magicAdmin.users.getMetadataByToken(DIDToken);
    if (!metadata) {
      throw new Error("Metadata not defined");
    } else {
      if (!metadata.email || !metadata.issuer || !metadata.publicAddress) {
        throw new Error("DIDToken does not contain relevant metadata");
      }
    }

    // create a json web token for subsequent requests to users table in hasura
    const HASURA_JWT_SECRET_KEY = process.env.HASURA_JWT_SECRET_KEY;
    const token =
      HASURA_JWT_SECRET_KEY &&
      jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        HASURA_JWT_SECRET_KEY
      );
    const newUser = token && (await checkIfNewUser(token, metadata.issuer));
    newUser && (await createNewUserRecord(token, metadata));
    token && setTokenCookie(token, res);
    return res.status(200).json({ success: "Login successful" });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
}

export default handler;
