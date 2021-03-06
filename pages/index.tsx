import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import Banner from "../components/banner/banner";
import SectionCard from "../components/card/section-card";
import NavBar from "../components/nav/navbar";
import { verifyTokenAuthentication } from "../lib/cookies";
import { getPopularVideos, getVideos, getWatchItAgainVideos } from "../lib/videos";
import { VideoFields } from "../models";
import styles from "../styles/Home.module.css";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { userId, token, error } = verifyTokenAuthentication(context);
  if (error) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const videosWatched = await getWatchItAgainVideos(token, userId);
  const horrorVideos: VideoFields[] = await getVideos("horror movie trailer");
  const comedyVideos: VideoFields[] = await getVideos("comedy movie trailer");
  const gamingVideos: VideoFields[] = await getVideos("gaming trailer");
  const popularVideos: VideoFields[] = await getPopularVideos();
  return {
    props: {
      horrorVideos,
      comedyVideos,
      gamingVideos,
      popularVideos,
      videosWatched,
    },
  };
};

const Home = ({
  horrorVideos,
  comedyVideos,
  gamingVideos,
  popularVideos,
  videosWatched,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix HomePage Copy</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.main}>
        <NavBar />
        <Banner
          videoId='mqqft2x_Aa4'
          title='Batman The Arkham Knight'
          subtitle='The lonely bat strikes again'
          imageUrl='/static/batman.webp'
        />
        <div className={styles.sectionWrapper}>
          <SectionCard title='Horror' videos={horrorVideos} size='large' shouldScale />
        </div>
        <div className={styles.sectionWrapper}>
          <SectionCard title='Watch It Again' videos={videosWatched} size='small' shouldScale />
        </div>
        <div className={styles.sectionWrapper}>
          <SectionCard title='Gaming' videos={gamingVideos} size='small' shouldScale />
        </div>
        <div className={styles.sectionWrapper}>
          <SectionCard title='Comedy' videos={comedyVideos} size='medium' shouldScale />
        </div>
        <div className={styles.sectionWrapper}>
          <SectionCard title='Popular' videos={popularVideos} size='small' shouldScale />
        </div>
      </div>
    </div>
  );
};

export default Home;
