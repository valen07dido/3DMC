"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./page.module.css";

const Page = () => {
  const id = usePathname().split("/").pop(); // Obtener el ID de la URL
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const router = useRouter();

  // Función para manejar el carrito en localStorage
  const getCartFromLocalStorage = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  };

  const addToCart = () => {
    const cart = getCartFromLocalStorage();
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1; // Si el producto ya existe, se incrementa la cantidad
    } else {
      cart.push({ ...product, quantity: 1 }); // Si no, se añade al carrito con cantidad 1
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Guardamos el carrito en localStorage
    alert("Producto añadido al carrito");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null); // Reiniciar el error en una nueva solicitud
      try {
        const response = await fetch(`/api/getModel/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]); // Asumimos que el primer elemento es el producto
          setSelectedImage(data[0].image[0]); // Establecer la primera imagen como la predeterminada
        } else {
          throw new Error("Product not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product data found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.productDetails}>
        <div className={styles.flex1}>
          <div>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.description}>{product.description}</p>
          </div>
          <div className={styles.gallery}>
            {/* Imagen seleccionada en vista más grande */}
            <div className={styles.selectedImage}>
              <img src={selectedImage} alt={product.name} />
            </div>

            {/* Miniaturas para la galería de imágenes */}
            <div className={styles.thumbnailGallery}>
              {product.image.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbnail}
                  onClick={() => setSelectedImage(image)} // Cambiar la imagen grande al hacer clic
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className={styles.productInfo}>
            <h2>Detalles del Producto</h2>
            <p>
              <strong>Categoría:</strong> {product.categories}
            </p>
            <p>
              <strong>Tipo:</strong> {product.type}
            </p>

            <h3>Características</h3>
            <ul>
              {product.characteristics.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>
          <h1 className={styles.price}>${product.price}</h1>
          <button className={styles.addToCartButton} onClick={addToCart}>
            Añadir al carrito
          </button>
          <button
            className={styles.viewCartButton}
            onClick={() => router.push("/cart")} // Redirigir al carrito
          >
            Ir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
