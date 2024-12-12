import React, { useEffect, useState } from "react";
import styles from "./GridProduct.module.css"; // Asegúrate de tener los estilos adecuados para la grilla
import Card from "@/Components/Card/Card";
import Image from "next/image";
import imageLoading from "@/public/loading.svg";
import CardGrid from "../CardGrid/CardGrid";

const GridProduct = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [array, setArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${url}/api/getModel?t=${new Date().getTime()}`,
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
        const filteredData = data.filter((item) => item.carrousel);
        setArray(filteredData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <div className={styles.gridContainer}>
      {loading ? (
        <Image src={imageLoading} width={50} height={50} alt="Loading" />
      ) : (
        <div className={styles.grid}>
          {array.map((item, index) => (
            <div key={index} className={styles.cardContainer}>
              <CardGrid
                img={item.image[0]}
                title={item.name}
                className={styles.cartas}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GridProduct;
