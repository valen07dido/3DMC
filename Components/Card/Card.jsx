"use client";
import React from "react";
import Image from "next/image";
import styles from "./Card.module.css";

const Card = ({ img, title, price }) => {
  return (
    <div className={styles.container}>
      <Image src={img} width={350} height={350} className={styles.image} alt={title} />
      {/* Tooltip */}
      <div className={styles.tooltip}>
        {title} - ${price}
      </div>
    </div>
  );
};

export default Card;
