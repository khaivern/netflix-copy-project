import {
  GetVideosSuccessResponseField,
  PopularVideosSuccessResponseField,
  SingleVideoSuccessResponseField,
} from "../models";

export const extractFieldsForListOfVideos = (arrayOfVideos: GetVideosSuccessResponseField[]) =>
  arrayOfVideos.map((item) => ({
    id: item.id.videoId || item.id.channelId,
    title: item.snippet.title,
    description: item.snippet.description,
    imageUrl: `https://i.ytimg.com/vi/${item.id.videoId || item.id.channelId}/maxresdefault.jpg`,
  }));
export const extractFieldsForPopularVideos = (arrayOfVideos: PopularVideosSuccessResponseField[]) =>
  arrayOfVideos.map((item) => ({
    //@ts-ignore
    id: item.id || item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    //@ts-ignore
    imageUrl: `https://i.ytimg.com/vi/${item.id || item.id.videoId}/maxresdefault.jpg`,
  }));
export const extractFieldsForSpecificVideo = (arrayOfVideos: SingleVideoSuccessResponseField[]) =>
  arrayOfVideos.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    imageUrl: `https://i.ytimg.com/vi/${item.id}/maxresdefault.jpg`,
    channelTitle: item.snippet.channelTitle!,
    publishTime: item.snippet.publishedAt!,
    viewCount: item.statistics.viewCount,
  }));
