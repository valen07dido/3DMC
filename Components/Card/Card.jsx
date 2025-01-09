"use client";
import React from "react";
import Image from "next/image";
import styles from "./Card.module.css";

const Card = ({ img, title, price }) => {
  return (
    <div className={styles.container}>
      <Image src={img} width={350} height={350} className={styles.image} alt={title} />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <h2 className={styles.price}>${price}</h2>
      </div>
    </div>
  );
};

export default Card;
