"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import Carousel from "@/Components/Carousel/Carousel";
import img3 from "@/public/products/batman/batman1.png";
import img4 from "../public/products/harry_potter/harrypotter1.png";
import img5 from "../public/products/trex/trex1.png";
import HorizontalCard from "@/Components/HorizontalCard/HorizontalCard";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css"; // Importa los estilos de AOS

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1500, // Duración de la animación
      once: true, // Solo se activa una vez
    });
  }, []);
  const horizontalArr = [
    {
      img: img5,
      title: "T-REX",
      text: "Un poderoso tiranosaurio para espantar a todas tus visitas!",
      orientation: "D",
    },
    {
      img: img3,
      title: "Batman",
      text: "Figura de accion super-realista del caballero de la noche",
      orientation: "D",
    },
    {
      img: img4,
      title: "Funko Harry Potter",
      text: "Un Excelente adorno para tener en tu repisa y coleccionarlos",
      orientation: "I",
    },
  ];
  return (
    <main className={styles.main}>
      <div className={styles.banner}>
        <h1 className={styles.title}>Soluciones 3D</h1>
      </div>
      <div>
        <h1 className={styles.title2}>Quienes somos?</h1>
      </div>
      <div className={styles.carousel}>
        <Carousel className={styles.carouselcomp} />
      </div>
      <div className={styles.processSection}>
        <h2 className={styles.title4}>Nuestro Proceso de Impresión 3D</h2>
        <p className={styles.subtitle}>
          Desde la idea hasta el modelo final, cada paso es crucial para crear
          algo único.
        </p>

        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <h3>1. Diseño</h3>
            <p>
              El proceso comienza con el diseño del modelo 3D, donde trabajamos
              con tus ideas o proporcionamos diseños personalizados.
            </p>
          </div>

          <div className={styles.step}>
            <h3>2. Preparación</h3>
            <p>
              Una vez aprobado el diseño, preparamos el archivo para la
              impresión, ajustando cada detalle para una ejecución perfecta.
            </p>
          </div>

          <div className={styles.step}>
            <h3>3. Impresión</h3>
            <p>
              Con todo listo, comienza la impresión 3D, un proceso que puede
              tomar desde horas hasta días dependiendo del modelo.
            </p>
          </div>

          <div className={styles.step}>
            <h3>4. Postprocesamiento</h3>
            <p>
              Tras la impresión, realizamos los detalles finales como el
              acabado, pintado o ensamblaje si es necesario.
            </p>
          </div>
        </div>
        <p className={styles.subtitle}>
          Queres un proyecto personalizado? pedilo haciendo click en el
          siguiente boton!!
        </p>
        <div className={styles.cta}>
          <Link href="/peticiones">
            <button className={styles.ctaButton}>
              ¡Inicia tu proyecto ahora!
            </button>
          </Link>
        </div>
      </div>
      <div
        className={styles.box}
        data-aos="fade-right"
        data-aos-duration="1000"
      >
        <h1>Conoce Nuestros diseños mas vendidos?</h1>
        <h3>
          Haciendo click en el siguiente boton vas a conocer la magia de nuestros mejores articulos.
         </h3>
         <div className={styles.cta2}>
          <Link href="/productos">
            <button className={styles.ctaButton}>
              Productos
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
