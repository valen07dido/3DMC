"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Carousel.module.css";
import Card from "@/Components/Card/Card";
import Image from "next/image";
import imageLoading from "@/public/loading.svg";
import Link from "next/link";

export default function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    swipeToSlide: true,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const url = process.env.NEXT_PUBLIC_API_URL;
  const [array, setArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/getModel?limit=999999"?`, // Añadir un query para evitar el cache
          {
            method: "GET",
            headers: {
              "Cache-Control": "no-cache", // Para evitar la caché
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data)
        console.log("Productos recibidos:", data.products); // Verifica los datos que recibes

        // Filtrar los productos que tienen 'carrousel' como true
        const filteredData = data.products.filter(item => item.carrousel === true);

        // Actualizar el estado con los productos filtrados
        setArray(filteredData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // El array vacío asegura que esto solo se ejecute al montar el componente

  return (
    <div className={styles.carouselContainer}>
      {loading ? (
        <Image src={imageLoading} width={50} height={50} alt="cargando" />
      ) : (
        <Slider {...settings} className={styles.carousel}>
          {array.length > 0 ? (
            array.map((item, index) => (
              <Link href={`/productos/${item.id}`} key={index} className={styles.cardContainer}>
                <Card
                  img={item.image[0]}
                  title={item.name}
                  className={styles.cartas}
                  price={item.price}
                />
              </Link>
            ))
          ) : (
            <p>No hay productos en el carrusel.</p> // Mensaje si no hay productos para mostrar
          )}
        </Slider>
      )}
    </div>
  );
}
