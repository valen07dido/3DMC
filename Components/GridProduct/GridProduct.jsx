import React, { useEffect, useState } from "react";
import styles from "./GridProduct.module.css"; // Asegúrate de tener los estilos adecuados
import Image from "next/image";
import imageLoading from "@/public/loading.svg";
import Slider from "react-slick"; // Importar react-slick
import Link from "next/link";

const GridProduct = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [array, setArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/getModel?t=${new Date().getTime()}`,
          {
            method: "GET",
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const filteredData = data.products.filter((item) => item.carrousel);
        setArray(filteredData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  // Configuración del carrusel
  const settings = {
    dots: false, // Desactiva los puntos de navegación
    infinite: true, // Carrusel infinito
    speed: 1000, // Velocidad de transición
    slidesToShow: 5, // Mostrar 3 elementos a la vez
    slidesToScroll: 1, // Desplazar 1 elemento a la vez
    autoplay: true, // Activar autoplay
    autoplaySpeed: 2000, // Velocidad del autoplay (2 segundos por cada slide)
    arrows: false, // Desactiva las flechas de navegación
    pauseOnHover: false, // Desactiva la pausa al pasar el mouse
    responsive: [
      {
        breakpoint: 1024, // Pantallas medianas (tabletas)
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600, // Pantallas pequeñas (móviles)
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.gridContainer}>
      {loading ? (
        <Image src={imageLoading} width={100} height={100} alt="Loading" />
      ) : (
        <Slider {...settings} className={styles.carousel}>
          {array.map((item, index) => (
            <Link key={index} className={styles.cardContainer} href={`/productos/${item.id}`}>
              <Image
                height={200}
                width={200}
                src={item.image[0]}
                alt={item.name}
                className={styles.cartas}
              />
              <h3>{item.name}</h3>
            </Link>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default GridProduct;
