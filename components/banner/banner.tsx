import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

import { BannerProps } from "../../models";
import classes from "./banner.module.css";

const Banner: React.FC<BannerProps> = ({ videoId, title, subtitle, imageUrl }) => {
  const router = useRouter();
  const playButtonHandler = () => {
    router.push(`/video/${videoId}`);
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftWrapper}>
        <div className={classes.left}>
          <div className={classes.nseriesWrapper}>
            <p className={classes.firstLetter}>N</p>
            <p className={classes.series}>S E R I E S</p>
          </div>
          <h3 className={classes.title}>{title}</h3>
          <h3 className={classes.subTitle}>{subtitle}</h3>

          <div className={classes.playBtnWrapper}>
            <button className={classes.btnWithIcon} onClick={playButtonHandler}>
              <Image src='/static/play-arrow_icon.svg' alt='Play icon' width='32px' height='32px' />
              <span className={classes.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={classes.bannerImg}
        style={{
          backgroundImage: `url(${imageUrl}`,
        }}></div>
    </div>
  );
};

export default Banner;
