import { MagicUserMetadata } from "@magic-sdk/admin";
import axios from "axios";
import { RequiredFieldsInStatsTable, VideosWatchedFields } from "../../models";

export async function checkIfNewUser(token: string, issuer: string): Promise<boolean> {
  const isNewUserDoc = `
    query MyQuery($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        email
        id
        publicAddress
      }
    }
  `;
  const response = await axiosHasuraGraphQL(isNewUserDoc, "MyQuery", { issuer }, token);
  return response?.data?.users.length === 0;
}

export async function createNewUserRecord(token: string, metadata: MagicUserMetadata) {
  const { email, issuer, publicAddress } = metadata;
  const createNewUserDoc = `
    mutation MyMutation($email:String! $issuer:String!, $publicAddress:String!) {
      insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
        returning {
          email
          id
          issuer
          publicAddress
        }
      }
    }
  `;
  const response = await axiosHasuraGraphQL(
    createNewUserDoc,
    "MyMutation",
    { email, issuer, publicAddress },
    token
  );
  return response;
}

export async function getVideosClickedByUser(token: string, userId: string, videoId: string) {
  const getVideosByUserIdDoc = `
    query MyQuery($userId: String!, $videoId: String!) {
      stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
        id
        userId
        isFavourite
        videoId
        watched
      }
    }
  `;
  const response = await axiosHasuraGraphQL(
    getVideosByUserIdDoc,
    "MyQuery",
    { userId, videoId },
    token
  );
  return response?.data?.stats;
}

export async function updateVideoFieldsByUserId(
  token: string,
  { userId, videoId, isFavourite = 0, watched = true }: RequiredFieldsInStatsTable
) {
  const updateVideoFieldsByUserIdDoc = `
    mutation MyMutation($videoId: String!, $userId: String!, $isFavourite: Int!, $watched: Boolean!) {
      update_stats(where: {
        videoId: {_eq: $videoId},
        userId: {_eq: $userId}
      }, _set: {
        isFavourite: $isFavourite,
        watched: $watched
      }) {
        affected_rows
      }
    }
  `;
  const response = await axiosHasuraGraphQL(
    updateVideoFieldsByUserIdDoc,
    "MyMutation",
    { userId, videoId, isFavourite, watched },
    token
  );
  return response;
}

export async function insertVideoRow(
  token: string,
  { userId, videoId, isFavourite = 0, watched = true }: RequiredFieldsInStatsTable
) {
  const insertVideoRowDoc = `
    mutation MyMutation($isFavourite: Int!, $userId: String!, $videoId: String!, $watched: Boolean!) {
      insert_stats_one(object:{
        isFavourite: $isFavourite,
        userId: $userId,
        videoId: $videoId,
        watched: $watched
      }) {
        id
        isFavourite
        userId
        videoId
        watched
      }
    }
  `;
  const response = await axiosHasuraGraphQL(
    insertVideoRowDoc,
    "MyMutation",
    { isFavourite, userId, videoId, watched },
    token
  );
  return response;
}

export const getWatchedVideos = async (
  token: string,
  userId: string
): Promise<VideosWatchedFields[]> => {
  const getWatchedVideosDoc = `
    query MyQuery($userId: String!) {
      stats(where: {
        userId: {_eq: $userId},
        watched: {_eq: true}}) {
          videoId
        }
      }
   `;
  const response = await axiosHasuraGraphQL(getWatchedVideosDoc, "MyQuery", { userId }, token);
  return response?.data?.stats;
};

export async function getFavouritedVideos(
  token: string,
  userId: string
): Promise<VideosWatchedFields[]> {
  const getFavouritedVideosDoc = `
    query MyQuery($userId: String!) {
      stats(where: {
        userId: {_eq: $userId},
        isFavourite: {_eq: 1}}) {
          videoId
        }
      }
    `;
  const response = await axiosHasuraGraphQL(getFavouritedVideosDoc, "MyQuery", { userId }, token);
  return response?.data?.stats;
}

async function axiosHasuraGraphQL(
  operationsDoc: string,
  operationName: string,
  variables: object,
  token: string
) {
  const HASURA_ADMIN_URL = process.env.NEXT_PUBLIC_HASURA_ADMIN_URL;
  // const HASURA_ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
  if (!HASURA_ADMIN_URL) {
    return { errors: "Hasura admin url is not defined", data: {} };
  }
  const result = await axios({
    url: HASURA_ADMIN_URL,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "POST",
    data: {
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    },
  });
  return result.data;
}
