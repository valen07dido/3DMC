"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Card from "@/Components/Card/Card";
import Link from "next/link";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: "", type: "" });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loadingProducts, setLoadingProducts] = useState(false); // Estado para carga de productos
  const [loadingPagination, setLoadingPagination] = useState(false); // Estado para carga de paginación

  // Efecto para cargar productos cuando cambian los filtros o la página
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true); // Iniciar carga de productos
      const { category, type } = filters;
      const response = await fetch(
        `/api/getModel?page=${pagination.page}&limit=10&category=${category}&type=${type}`
      );
      const data = await response.json();
      setProducts(data.products);
      setPagination({ page: data.page, totalPages: data.totalPages });
      setLoadingProducts(false); // Finalizar carga de productos
    };

    fetchProducts();
  }, [filters, pagination.page]); // Volver a ejecutar cuando cambian los filtros o la página

  // Efecto para desactivar el estado de carga de la paginación
  useEffect(() => {
    if (!loadingProducts) {
      setLoadingPagination(false); // Desactivar la carga de la paginación una vez que los productos se hayan cargado
    }
  }, [loadingProducts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 1 }); // Restablecer a la primera página cuando cambian los filtros
  };

  const handlePageChange = (newPage) => {
    if (
      newPage !== pagination.page &&
      newPage > 0 &&
      newPage <= pagination.totalPages
    ) {
      setLoadingPagination(true); // Iniciar carga de nueva página
      setPagination({ ...pagination, page: newPage });
    }
  };

  // Crear un rango de páginas para mostrar los botones de paginación
  const pageNumbers = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Productos</h1>

      {/* Filtros */}
      <div className={styles.filters}>
        <select
          name="category"
          onChange={handleFilterChange}
          value={filters.category}
        >
          <option value="">Todas las categorías</option>
          <option value="Figura">Figura</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Funko Pop">Funko Pop</option>
        </select>
        <select name="type" onChange={handleFilterChange} value={filters.type}>
          <option value="">Todos los tipos</option>
          <option value="adorno de mesa">Adorno de mesa</option>
          <option value="articulado">Articulado</option>
        </select>
      </div>

      {/* Pantalla de carga mientras se cargan los productos */}
      {loadingProducts ? (
        <div className={styles.loading}>Cargando productos...</div>
      ) : (
        <div className={styles.box}>
          {products.map((item, index) => (
            <Link
              key={index}
              className={styles.cardContainer}
              href={`/productos/${item.id}`}
            >
              <Card
                img={item.image[0]} // Asegúrate de usar la primera imagen o la principal
                title={item.name}
                className={styles.cartas}
                price={item.price}
              />
            </Link>
          ))}
        </div>
      )}

      {/* Paginación */}
      <div className={styles.pagination}>
        {/* Botón de "Anterior" */}
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1 || loadingPagination}
        >
          Anterior
        </button>

        {/* Botones para los números de página */}
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={pagination.page === pageNumber ? styles.activePage : ""}
            disabled={loadingPagination}
          >
            {pageNumber}
          </button>
        ))}

        {/* Botón de "Siguiente" */}
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={
            pagination.page === pagination.totalPages || loadingPagination
          }
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
