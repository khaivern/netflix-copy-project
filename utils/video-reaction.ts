import axios from "axios";

// send request to update reaction status
export const sendAxiosReactionRequest = async ({
  isFavourite = 0,
  id,
}: {
  isFavourite: number;
  id: string;
}) => {
  return await axios({
    url: "/api/stats",
    method: "POST",
    data: {
      isFavourite,
    },
    params: {
      videoId: id,
    },
  });
};

// send request to get reaction status
export const getAxiosReactionRequest = async ({ id }: { id: string }) => {
  const response = await axios({
    url: "/api/stats",
    method: "GET",
    params: {
      videoId: id,
    },
  });
  const { error, video } = response.data;
  if (error) {
    console.error("Video not found");
  }
  return video;
};
