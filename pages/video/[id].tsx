import React, { useEffect, useState } from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Modal from "react-modal";
import cls from "classnames";

import { getVideoById } from "../../lib/videos";
import { getAxiosReactionRequest, sendAxiosReactionRequest } from "../../utils";
import NavBar from "../../components/nav/navbar";
import Like from "../../components/icons/like-icon";
import DisLike from "../../components/icons/dislike-icon";
import classes from "../../styles/Video.module.css";

Modal.setAppElement("#__next");

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as { id: string };
  let video;
  try {
    video = await getVideoById(id);
  } catch (err) {
    console.log(err);
  }
  return {
    props: {
      video,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = () => {
  const listOfVideos = ["mqqft2x_Aa4", "9GgxinPwAGc", "HhesaQXLuRY"];
  const listOfVideoPaths = listOfVideos.map((id) => ({ params: { id } }));
  return {
    paths: listOfVideoPaths,
    fallback: "blocking",
  };
};

const VideoDetailPage = ({
  video: { title, channelTitle, description, publishTime, viewCount },
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // get id from url param
  const router = useRouter();
  const { id } = router.query as { id: string };

  // format date to human readable format
  const formattedDate = new Date(publishTime).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Like and Dislike onclick handlers
  const [isLikedReaction, setIsLikedReaction] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const toggleLikeHandler = async () => {
    setIsLikedReaction(true);
    setIsTouched(true);
    const response = await sendAxiosReactionRequest({ isFavourite: 1, id });
    console.log(response);
  };

  const toggleDisLikeHandler = async () => {
    setIsLikedReaction(false);
    setIsTouched(true);
    const response = await sendAxiosReactionRequest({ isFavourite: 0, id });
    console.log(response);
  };

  // send GET request when component mounts
  useEffect(() => {
    const sendGetRequest = async () => {
      const { isFavourite, watched } = await getAxiosReactionRequest({ id });
      watched && setIsTouched(true);
      watched && setIsLikedReaction(isFavourite === 1 ? true : false);
    };
    sendGetRequest();
  }, [id]);

  return (
    <div>
      <NavBar />
      <Modal
        isOpen={true}
        onRequestClose={() => router.back()}
        contentLabel='Example Modal'
        overlayClassName={classes.overlay}
        className={classes.modal}>
        <iframe
          className={classes.videoPlayer}
          id='ytplayer'
          typeof='text/html'
          width='100%'
          height='360'
          src={`https://www.youtube.com/embed/${id}?autoplay=0&origin=http://example.com`}
          frameBorder='0'></iframe>
        <div className={classes.likeDislikeBtnWrapper}>
          <div className={classes.likeBtnWrapper}>
            <button onClick={toggleLikeHandler}>
              <div className={classes.btnWrapper}>
                <Like selected={isTouched && isLikedReaction} />
              </div>
            </button>
          </div>
          <button onClick={toggleDisLikeHandler}>
            <div className={classes.btnWrapper}>
              <DisLike selected={isTouched && !isLikedReaction} />
            </div>
          </button>
        </div>
        <div className={classes.modalBody}>
          <div className={classes.modalBodyContent}>
            <div className={classes.col1}>
              <p className={classes.publishTime}>{formattedDate}</p>
              <p className={classes.title}>{title}</p>
              <p className={classes.description}>{description}</p>
            </div>
            <div className={classes.col2}>
              <p className={cls(classes.subText, classes.subTextWrapper)}>
                <span className={classes.textColor}>Cast:</span>
                <span className={classes.channelTitle}>{channelTitle}</span>
              </p>
              <p className={cls(classes.subText, classes.subTextWrapper)}>
                <span className={classes.textColor}>View Count:</span>
                <span className={classes.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoDetailPage;
