import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React from "react";
import SectionCard from "../../components/card/section-card";
import NavBar from "../../components/nav/navbar";
import { verifyTokenAuthentication } from "../../lib/cookies";
import { getMyListVideos } from "../../lib/videos";

import classes from "../../styles/MyList.module.css";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { token, userId, error } = verifyTokenAuthentication(context);
  if (error) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const myListVideos = await getMyListVideos(token, userId);
  return {
    props: {
      myListVideos,
    },
  };
};

const MyListPage = ({ myListVideos }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={classes.main}>
        <NavBar />
        <div className={classes.sectionWrapper}>
          <SectionCard
            title='Your Favourite Videos'
            videos={myListVideos}
            size='small'
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export default MyListPage;
