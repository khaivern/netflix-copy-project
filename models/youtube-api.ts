export interface BaseResponseField {
  snippet: {
    title: string;
    description: string;
    thumbnails: { high: { url: string } };
    channelTitle?: string;
    publishedAt?: string;
  };
}
export interface GetVideosSuccessResponseField extends BaseResponseField {
  id: { videoId?: string; channelId: string };
}
export interface PopularVideosSuccessResponseField extends BaseResponseField {
  id: string;
}
export interface SingleVideoSuccessResponseField extends BaseResponseField {
  id: string;
  statistics: {
    viewCount: string;
  };
}
