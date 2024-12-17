"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import Card from "@/Components/Card/Card";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: "", type: "" });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    const fetchProducts = async () => {
      const { category, type } = filters;
      const response = await fetch(`/api/getModel?page=${pagination.page}&limit=10&category=${category}&type=${type}`);
      const data = await response.json();
      setProducts(data.products);
      setPagination({ page: data.page, totalPages: data.totalPages });
    };

    fetchProducts();
  }, [filters, pagination.page]);  // Volver a ejecutar cuando cambian los filtros o la página

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 1 }); // Restablecer a la primera página cuando cambian los filtros
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Productos</h1>
      
      {/* Filtros */}
      <div className={styles.filters}>
        <select name="category" onChange={handleFilterChange} value={filters.category}>
          <option value="">Todas las categorías</option>
          <option value="Figura">Figura</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Funko Pop">Funko Pop</option>
          {/* Agrega otras categorías según tus datos */}
        </select>
        <select name="type" onChange={handleFilterChange} value={filters.type}>
          <option value="">Todos los tipos</option>
          <option value="adorno de mesa">Adorno de mesa</option>
          <option value="articulado">Articulado</option>
          {/* Agrega otros tipos si es necesario */}
        </select>
      </div>
      
      {/* Mostrar productos */}
      <div className={styles.box}>
        {products.map((item, index) => (
          <div key={index} className={styles.cardContainer}>
            <Card
              img={item.image[0]} // Asegúrate de usar la primera imagen o la principal
              title={item.name}
              className={styles.cartas}
            />
          </div>
        ))}
      </div>
      
      {/* Paginación */}
      <div className={styles.pagination}>
        <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>
          Anterior
        </button>
        <span>{pagination.page} de {pagination.totalPages}</span>
        <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
