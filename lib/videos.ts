import axios from "axios";
import {
  extractFieldsForListOfVideos,
  extractFieldsForPopularVideos,
  extractFieldsForSpecificVideo,
} from "../utils";
import videoDevelopmentData from "../data/videos.json";
import { getFavouritedVideos, getWatchedVideos } from "./db/hasura";

export const invokeYoutubeAPICall = async (url: string, params: object) => {
  const isDevelopmentStage = process.env.DEVELOPMENT_STAGE;
  if (!isDevelopmentStage) {
    return videoDevelopmentData.items;
  }
  try {
    const response = await axios({
      url: `https://youtube.googleapis.com/youtube/v3/${url}`,
      params: { ...params, key: process.env.YOUTUBE_API_KEY },
    });
    if (response.status !== 200) throw new Error("Youtube API error");
    const data = response.data.items;
    return data;
  } catch (err: any) {
    console.log(err);
    return [];
  }
};

export const getVideos = async (query: string) => {
  const params = {
    part: "snippet",
    maxResults: "5",
    q: query,
  };
  try {
    const resultsArray = await invokeYoutubeAPICall("search", params);
    if (resultsArray.length === 0) {
      throw new Error("Zero results returned");
    }
    return extractFieldsForListOfVideos(resultsArray);
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getPopularVideos = async () => {
  const params = {
    part: "snippet,contentDetails,statistics",
    chart: "mostPopular",
    regionCode: "US",
  };
  try {
    const resultsArray = await invokeYoutubeAPICall("videos", params);
    if (resultsArray.length === 0) {
      throw new Error("Zero results returned");
    }
    return extractFieldsForPopularVideos(resultsArray);
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getVideoById = async (id: string) => {
  const params = {
    part: "snippet,contentDetails,statistics",
    id,
  };
  try {
    const resultsArray = await invokeYoutubeAPICall("videos", params);
    if (resultsArray.length === 0) {
      throw new Error("Zero results returned");
    }
    const result = extractFieldsForSpecificVideo(resultsArray)[0];
    return result;
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const getWatchItAgainVideos = async (token: string, userId: string) => {
  //
  const videosWatched = await getWatchedVideos(token, userId);
  const formattedVideosWatched = videosWatched?.map((video) => ({
    id: video.videoId,
    title: "test",
    description: "description",
    imageUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
  }));
  return formattedVideosWatched;
};

export const getMyListVideos = async (token: string, userId: string) => {
  const favouritedVideos = await getFavouritedVideos(token, userId);
  const formattedFavouritedVideos = favouritedVideos?.map((video) => ({
    id: video.videoId,
    title: "test",
    description: "description",
    imageUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
  }));
  return formattedFavouritedVideos;
};
