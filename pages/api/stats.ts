import { NextApiRequest, NextApiResponse } from "next";
import {
  getVideosClickedByUser,
  insertVideoRow,
  updateVideoFieldsByUserId,
} from "../../lib/db/hasura";
import { RequiredFieldsInStatsTable } from "../../models";
import { verifyTokenCookie } from "../../lib/cookies";

async function handlePostRequest(
  token: string,
  listOfVideos: Array<any>,
  options: RequiredFieldsInStatsTable
) {
  let response;
  if (listOfVideos.length === 0) {
    response = await insertVideoRow(token, options);
  } else {
    response = await updateVideoFieldsByUserId(token, options);
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // reject request if method is not GET or POST
  if (!(req.method === "POST" || req.method === "GET")) {
    return res.status(405).json({ message: "Invalid method" });
  }

  // extract required fields from request body/cookies/query parameters
  const token = req.cookies.token;
  const videoId = req.query.videoId as string;
  const { watched, isFavourite } = req.body as {
    watched?: boolean;
    isFavourite?: number;
  };

  try {
    if (!token || !videoId) {
      return res.status(403).json({ message: "Missing required token / videoId" });
    } else {
      const userId = verifyTokenCookie(token);
      if (!userId) {
        throw new Error("User Id not present in cookie");
      }
      const listOfVideos = await getVideosClickedByUser(token, userId, videoId);
      let response;
      if (req.method === "POST") {
        // POST request
        response = await handlePostRequest(token, listOfVideos, {
          videoId,
          isFavourite,
          watched,
          userId,
        });
        return res.status(200).json({ message: "token received", listOfVideos, response });
      } else {
        // GET request
        if (listOfVideos.length === 0) {
          // No videos found
          return res.status(200).json({ error: "No videos found", video: {} });
        } else {
          return res.status(200).json({ error: "", video: listOfVideos[0] });
        }
      }
    }
  } catch (err: any) {
    console.error("Error occured in /stats", err);
    return res.status(500).json({ message: err.message });
  }
}

export default handler;
