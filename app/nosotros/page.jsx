"use client";
import React from "react";
import styles from "./page.module.css";
import Image from "next/image";

const Page = () => {
  return (
    <div className={styles.container}>
      {/* Sección de Bienvenida */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Conócenos</h1>
        <p className={styles.heroDescription}>
          Somos una empresa joven y apasionada por la tecnología de impresión 3D.
          Nuestra misión es traer tus ideas a la vida con precisión y creatividad.
        </p>
      </section>

      {/* Sección "¿Quiénes Somos?" */}
      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>¿Quiénes somos?</h2>
        <div className={styles.aboutContent}>
          <p>
            Fundados recientemente, nos especializamos en la creación de artículos
            personalizados e innovadores utilizando la última tecnología de
            impresión 3D. Nos esforzamos por ofrecer soluciones únicas, desde
            prototipos hasta productos finales, con un alto estándar de calidad.
          </p>
        </div>
      </section>

      {/* Nueva sección "Nuestros Valores y Emprendimiento" */}
      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>Nuestros Valores y Emprendimiento</h2>
        <div className={styles.valuesContent}>
          <p>
            En nuestra empresa, la innovación y la pasión son la base que impulsa
            cada proyecto. Creemos firmemente que transformar ideas en realidades
            tangibles es el camino para generar un cambio positivo y construir un
            futuro donde la creatividad se una con la tecnología.
          </p>
          <p>
            Nuestro espíritu emprendedor se refleja en el compromiso incansable de
            superar retos, aprender continuamente y adaptarnos a las demandas de
            un mercado en constante evolución. Valoramos la transparencia, el
            trabajo en equipo y la integridad, pilares esenciales que nos permiten
            crecer no solo como empresa, sino también como comunidad.
          </p>
          <p>
            Apostamos por soluciones sostenibles e innovadoras que van más allá de la
            simple creación de productos. Cada proyecto es una oportunidad para
            demostrar que, con determinación y creatividad, es posible marcar la
            diferencia, inspirar a otros y dejar una huella positiva en el mundo.
          </p>
          <p>
            Somos un equipo de soñadores y realizadores, convencidos de que el
            emprendimiento es el motor del cambio. Nos impulsa el deseo de crear,
            innovar y contribuir al desarrollo de nuevas ideas que transformen la
            forma en que se conciben y producen los objetos en el mundo actual.
          </p>
          <p>
            En definitiva, más que una empresa de impresión 3D, somos una familia de
            visionarios comprometidos con un propósito: impulsar la evolución de la
            tecnología y romper barreras para abrir nuevas oportunidades en diseño,
            producción e innovación.
          </p>
        </div>
      </section>

      {/* Sección de Equipo */}
      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>Nuestro Equipo</h2>
        <div className={styles.teamMembers}>
          <div className={styles.member}>
            <Image
              src="https://res.cloudinary.com/dpa8t14c2/image/upload/v1743449655/3DMC/rpngcqtlryaqh2hben02.jpg"
              alt="Miembro 1"
              width={175}
              height={175}
              className={styles.memberImage}
            />
            <p className={styles.memberName}>Martin Cintioni</p>
            <p className={styles.memberRole}>Fundador</p>
          </div>
          {/* <div className={styles.member}>
            <img
              src="/images/member2.jpg"
              alt="Miembro 2"
              className={styles.memberImage}
            />
            <p className={styles.memberName}>Ana García</p>
            <p className={styles.memberRole}>Directora de Diseño</p>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Page;
