"use client";
import React from "react";
import styles from "./page.module.css";

const Page = () => {
  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Conócenos</h1>
        <p className={styles.heroDescription}>
          Somos una empresa joven y apasionada por la tecnología de impresión 3D. Nuestra misión es traer tus ideas a la vida con precisión y creatividad.
        </p>
      </section>

      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>¿Quiénes somos?</h2>
        <div className={styles.aboutContent}>
          <p>
            Fundados recientemente, nos especializamos en la creación de artículos personalizados e innovadores utilizando la última tecnología de impresión 3D. Nos enfocamos en ofrecer soluciones únicas, desde prototipos hasta productos finales, con un alto estándar de calidad.
          </p>
        </div>
      </section>

      <section className={styles.gallerySection}>
        <h2 className={styles.sectionTitle}>Nuestro Trabajo</h2>
        <div className={styles.imageSlider}>
          <img
            src="/images/img1.jpg"
            alt="Producto 3D 1"
            className={styles.sliderImage}
          />
          <img
            src="/images/img2.jpg"
            alt="Producto 3D 2"
            className={styles.sliderImage}
          />
          <img
            src="/images/img3.jpg"
            alt="Producto 3D 3"
            className={styles.sliderImage}
          />
        </div>
      </section>

      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Nuestro Equipo</h2>
        <div className={styles.teamMembers}>
          <div className={styles.member}>
            <img
              src="/images/member1.jpg"
              alt="Miembro 1"
              className={styles.memberImage}
            />
            <p className={styles.memberName}>Juan Pérez</p>
            <p className={styles.memberRole}>CEO</p>
          </div>
          <div className={styles.member}>
            <img
              src="/images/member2.jpg"
              alt="Miembro 2"
              className={styles.memberImage}
            />
            <p className={styles.memberName}>Ana García</p>
            <p className={styles.memberRole}>Directora de Diseño</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
