"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/Components/Card/Card";
import Link from "next/link";
import styles from "./page.module.css";

const SearchPage = () => {
  const searchParams = useSearchParams(); // Hook para obtener los parámetros de consulta
  const term = searchParams.get("query"); // Obtiene el valor de 'term'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(term);
  useEffect(() => {
    if (term) {
      const fetchResults = async () => {
        try {
          const response = await fetch(`/api/search?query=${term}`);
          const data = await response.json();
          setResults(data);
          setLoading(false);
        } catch (error) {
          console.error("Error al obtener los resultados de búsqueda:", error);
          setLoading(false);
        }
      };

      fetchResults();
    } else {
      setLoading(false);
    }
  }, [term]);

  if (loading) {
    return <div>Cargando resultados...</div>;
  }

  if (results.length === 0) {
    return <div>No se encontraron resultados para "{term}"</div>;
  }

  return (
    <div>
      <h1>Resultados para "{term}"</h1>
      <div className={styles.box}>
        {results.map((item) => (
          <Link href={`/productos/${item.id}`} className={styles.cardContainer}>
            <Card title={item.name} price={item.price} img={item.image[0]} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
