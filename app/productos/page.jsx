"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Card from "@/Components/Card/Card";
import Link from "next/link";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: "", type: "" });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingPagination, setLoadingPagination] = useState(false);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  // Efecto para cargar productos y filtros cuando cambian los filtros o la página
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      const { category, type } = filters;
      const response = await fetch(
        `/api/getModel?page=${pagination.page}&limit=9&category=${category}&type=${type}`
      );
      const data = await response.json();
      setProducts(data.products);
      setPagination({ page: data.page, totalPages: data.totalPages });
      setLoadingProducts(false);
    };

    fetchProducts();
  }, [filters, pagination.page]);

  // Crear listas de categorías y tipos a partir de los productos
  useEffect(() => {
    const uniqueCategories = [...new Set(products.map((product) => product.categories))];
    const uniqueTypes = [...new Set(products.map((product) => product.type))];
    setCategories(uniqueCategories);
    setTypes(uniqueTypes);
  }, [products]);

  // Efecto para desactivar el estado de carga de la paginación
  useEffect(() => {
    if (!loadingProducts) {
      setLoadingPagination(false);
    }
  }, [loadingProducts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 1 }); // Restablecer a la primera página cuando cambian los filtros
  };

  const handlePageChange = (newPage) => {
    if (newPage !== pagination.page && newPage > 0 && newPage <= pagination.totalPages) {
      setLoadingPagination(true);
      setPagination({ ...pagination, page: newPage });
    }
  };

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
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <select name="type" onChange={handleFilterChange} value={filters.type}>
          <option value="">Todos los tipos</option>
          {types.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Pantalla de carga */}
      {loadingProducts ? (
        <div className={styles.loading}>Cargando productos...</div>
      ) : (
        <div className={styles.box}>
          {products.map((item, index) => (
            <Link key={index} className={styles.cardContainer} href={`/productos/${item.id}`}>
              <Card
                img={item.image[0]}
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
        <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1 || loadingPagination}>Anterior</button>
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
        <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages || loadingPagination}>Siguiente</button>
      </div>
    </div>
  );
};

export default ProductsPage;
