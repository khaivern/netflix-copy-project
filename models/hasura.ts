export interface RequiredFieldsInStatsTable {
  userId: string;
  videoId: string;
  isFavourite?: number;
  watched?: boolean;
}

export interface VideosWatchedFields {
  videoId: string;
}
