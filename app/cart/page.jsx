"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    setCart(storedCart ? JSON.parse(storedCart) : []);
  }, []);

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Usamos el carrito real que tenemos almacenado en el estado
      const response = await fetch("/api/mercadoPago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point; // Redirigir al usuario a Mercado Pago
      } else {
        console.error("Error: No se recibió init_point");
      }
    } catch (error) {
      console.error("Error en la creación de la preferencia:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  if (cart.length === 0) {
    return <div>No hay productos en el carrito</div>;
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.containerG}>
        <h1>Carrito de Compras</h1>
        {cart.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img
              src={item.image[0]} // Asegúrate de que item.image tenga la estructura correcta
              alt={item.name}
              className={styles.cartImage}
            />
            <div className={styles.cartItemDetails}>
              <h2>{item.name}</h2>
              <p>${item.price}</p>
              <p>Cantidad: {item.quantity}</p>
              <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
            </div>
          </div>
        ))}
        <button onClick={clearCart}>Vaciar carrito</button>
        <button onClick={handlePayment} disabled={loading}>
          {loading ? "Procesando..." : "Proceder al pago"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
