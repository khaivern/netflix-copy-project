import React from "react";
import Card from "./card";
import { SectionCardProps } from "../../models";
import cls from "classnames";

import classes from "./section-card.module.css";

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  videos,
  size,
  shouldWrap,
  shouldScale,
  isCentered,
}) => {
  return (
    <section className={classes.container}>
      <h2 className={classes.title}>{title}</h2>
      <div
        className={cls(
          classes.cardWrapper,
          shouldWrap && classes.wrap,
          isCentered && classes.centered
        )}>
        {videos.map((video, idx) => (
          <Card
            key={idx}
            id={video.id}
            imageUrl={video.imageUrl}
            size={size}
            shouldScale={shouldScale}
          />
        ))}
      </div>
    </section>
  );
};

export default SectionCard;
