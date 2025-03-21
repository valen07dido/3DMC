"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Slider from "react-slick"; // Importar react-slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from "./page.module.css";
import Card from "@/Components/Card/Card";
import Link from "next/link";
import Image from "next/image";

const Page = () => {
  const id = usePathname().split("/").pop();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [productExist, setProductExist] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const router = useRouter();
  const carouselSettings = {
    dots: true,
    infinite: relatedProducts.length > 3,
    speed: 500,
    slidesToShow:3,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: relatedProducts.length >= 2 ? 2 : 1,
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
  
  
  const getCartFromLocalStorage = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  };

  const addToCart = () => {
    const cart = getCartFromLocalStorage();
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Producto añadido al carrito");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/getModel/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
          setSelectedImage(data[0].image[0]);
          fetchRelatedProducts(data[0].categories);
        } else {
          setProductExist(false);
          setProduct(null);
        }
      } catch (error) {
        setError(error.message);
        setProductExist(false);
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
        const filteredProducts = data.products.filter(
          (prod) => prod.categories.includes(category) && prod.id !== id
        );
        console.log(filteredProducts)
        setRelatedProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchProduct();
  }, [id]);

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
        <h1 className={styles.info}>Error: {error}</h1>
      </div>
    );
  }

  if (!productExist) {
    return (
      <div className={styles.noProduct}>
        <h1 className={styles.info}>El producto no existe</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {product && (
        <div className={styles.productDetails}>
          <div className={styles.flex1}>
            <div>
              <h1 className={styles.name}>{product.name}</h1>
              <p className={styles.description}>{product.description}</p>
            </div>
            <div className={styles.gallery}>
              <div className={styles.selectedImage}>
                <Image
                  src={selectedImage}
                  alt={product.name}
                  width={200}
                  height={200}
                  quality={100}
                />
              </div>
              <div className={styles.thumbnailGallery}>
                {product.image.map((image, index) => (
                  <Image
                    height={100}
                    width={100}
                    quality={100}
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

      {relatedProducts.length > 0 ? (
        <div className={styles.relatedProducts}>
          <h2>Productos Relacionados</h2>

          {relatedProducts.length > 1 ? (
            <Slider {...carouselSettings} className={styles.carousel}>
              {relatedProducts.map((related) => (
                <Link key={related.id} href={`/productos/${related.id}`} className={styles.relatedCont}>
                  <Card
                    title={related.name}
                    img={related.image[0]}
                    price={related.price}
                  />
                </Link>
              ))}
            </Slider>
          ) : (
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
