"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    try {
      setCart(storedCart ? JSON.parse(storedCart) : []);
    } catch {
      console.error("Error al cargar el carrito desde localStorage");
      setCart([]);
    }
  }, []);

  // Eliminar un producto del carrito
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Vaciar el carrito completamente
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Manejar el proceso de pago
  const handlePayment = async () => {
    const items = cart.map((item) => ({
      title: item.name,
      description: item.description || "Sin descripción",
      picture_url: item.image?.[0] || "/default-image.jpg",
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS", // Moneda obligatoria
    }));
  
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });
  
      const data = await response.json();
  
      if (!data.init_point) {
        throw new Error("No se recibió init_point");
      }
  
      window.location.href = data.init_point;
    } catch (error) {
      console.error("Error en la creación de la preferencia:", error.message);
      alert("Ocurrió un error al procesar el pago.");
    }
  };
  
  
  // Mostrar mensaje si el carrito está vacío
  if (cart.length === 0) {
    return <div className={styles.emptyCart}>No hay productos en el carrito</div>;
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.containerG}>
        <h1>Carrito de Compras</h1>
        {cart.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <Image
              width={500}
              height={500}
              src={item.image?.[0] || "/default-image.jpg"} // Imagen del producto (con valor por defecto)
              alt={item.name}
              className={styles.cartImage}
            />
            <div className={styles.cartItemDetails}>
              <h2>{item.name}</h2>
              <p>Precio: ${item.price}</p>
              <p>Cantidad: {item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className={styles.button}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        <button onClick={clearCart} className={styles.button}>
          Vaciar carrito
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Procesando..." : "Proceder al pago"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
