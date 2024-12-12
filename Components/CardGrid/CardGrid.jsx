"use client";
import React from "react";
import Image from "next/image";
import styles from "./CardGrid.module.css";

const CardGrid = ({ img, title }) => {
  return (
    <div className={styles.container}>
      <Image src={img} width={350} height={350} className={styles.image} alt={title} />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <h3 className={styles.button}>{"Ver Más →"}</h3>
      </div>
    </div>
  );
};

export default CardGrid;
