"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Slider from "react-slick"; // Importar react-slick
import styles from "./page.module.css";
import Card from "@/Components/Card/Card";
import Link from "next/link";

const Page = () => {
  const id = usePathname().split("/").pop(); // Obtener el ID de la URL
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // Estado para productos relacionados
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const router = useRouter();

  // Configuración del carrusel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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
          fetchRelatedProducts(data[0].categories); // Obtener productos relacionados
        } else {
          throw new Error("Product not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (category) => {
      try {
        const response = await fetch(`/api/getModel`);
        if (!response.ok) {
          throw new Error("Failed to fetch related products");
        }
        const data = await response.json();

        // Filtrar productos relacionados que pertenezcan a la misma categoría
        const filteredProducts = data.products.filter(
          (prod) => prod.categories === category && prod.id !== id
        );

        setRelatedProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching related products:", error);
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
            <div className={styles.selectedImage}>
              <img src={selectedImage} alt={product.name} />
            </div>
            <div className={styles.thumbnailGallery}>
              {product.image.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbnail}
                  onClick={() => setSelectedImage(image)}
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
            onClick={() => router.push("/cart")}
          >
            Ir al carrito
          </button>
        </div>
      </div>
      {/* Carrusel de productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className={styles.relatedProducts}>
          <h2>Productos Relacionados</h2>
          <Slider {...carouselSettings} className={styles.carousel}>
            {relatedProducts.map((related) => (
              <Link key={related.id} href={`/productos/${related.id}`}>
                <Card title={related.name} img={related.image[0]} />
              </Link>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default Page;
