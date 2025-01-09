"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Slider from "react-slick"; // Importar react-slick
import styles from "./page.module.css";
import Card from "@/Components/Card/Card";
import Link from "next/link";
import Image from "next/image";

const Page = () => {
  const id = usePathname().split("/").pop(); // Obtener el ID de la URL
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null); // Usar null en lugar de [] para un producto
  const [productExist, setProductExist] = useState(true); // Estado para controlar si el producto existe
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
          setProductExist(false); // Si el producto no se encuentra, actualizamos el estado
          setProduct(null); // Aseguramos que product sea null cuando no existe
        }
      } catch (error) {
        setError(error.message);
        setProductExist(false); // También aseguramos que el producto no existe en caso de error
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

  // Manejo de los mensajes de carga y error
  if (loading) {
    return (
      <div className={styles.loading}>
        <h1 className={styles.info}>Cargando...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h1  className={styles.info}>Error: {error}</h1>
      </div>
    );
  }

  // Si no existe el producto
  if (!productExist) {
    return (
      <div className={styles.noProduct}>
        <h1  className={styles.info}>El producto no existe</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Detalles del producto */}
      {product && (
        <div className={styles.productDetails}>
          <div className={styles.flex1}>
            <div>
              <h1 className={styles.name}>{product.name}</h1>
              <p className={styles.description}>{product.description}</p>
            </div>
            <div className={styles.gallery}>
              <div className={styles.selectedImage}>
                <Image src={selectedImage} alt={product.name} width={200} height={200}/>
              </div>
              <div className={styles.thumbnailGallery}>
                {product.image.map((image, index) => (
                  <Image
                  height={100}
                  width={100}
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
      )}

      {/* Carrusel de productos relacionados */}
      {relatedProducts.length > 0 ? (
        <div className={styles.relatedProducts}>
          <h2>Productos Relacionados</h2>

          {/* Solo renderizamos el Slider si hay más de 1 producto relacionado */}
          {relatedProducts.length > 1 ? (
            <Slider {...carouselSettings} className={styles.carousel}>
              {relatedProducts.map((related) => (
                <Link key={related.id} href={`/productos/${related.id}`}>
                  <Card title={related.name} img={related.image[0]} price={related.price} />
                </Link>
              ))}
            </Slider>
          ) : (
            // Si solo hay un producto, lo mostramos sin el Slider
            <div className={styles.singleProduct}>
              <Link
                key={relatedProducts[0].id}
                href={`/productos/${relatedProducts[0].id}`}
              >
                <Card
                  title={relatedProducts[0].name}
                  img={relatedProducts[0].image[0]}
                  price={relatedProducts[0].price}
                />
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.noRelatedProducts}>
          <p>No hay productos relacionados para mostrar.</p>
        </div>
      )}
    </div>
  );
};

export default Page;
