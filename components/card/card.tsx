import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import cls from "classnames";

import { CardProps } from "../../models";
import classes from "./card.module.css";

const Card: React.FC<CardProps> = ({ imageUrl, size = "small", id, shouldScale }) => {
  const classMap = {
    large: classes.lgItem,
    medium: classes.mdItem,
    small: classes.smItem,
  };
  if (imageUrl === "") {
    imageUrl = "/static/404.webp";
  }
  const [image, setImage] = useState(imageUrl);

  const isHoverable = shouldScale && {
    whileHover: { scale: 1.1 },
  };

  return (
    <Link href={`/video/${id}`}>
      <a>
        <div className={classes.container}>
          <motion.div className={cls(classes.imgMotionWrapper, classMap[size])} {...isHoverable}>
            <Image
              src={image}
              onError={() => setImage("/static/404.webp")}
              alt='image'
              layout='fill'
              className={classes.cardImg}
              priority
            />
          </motion.div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
