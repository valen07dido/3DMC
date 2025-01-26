"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // Agregar estado para total

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    try {
      const cartData = storedCart ? JSON.parse(storedCart) : [];
      setCart(cartData);
    } catch {
      console.error("Error al cargar el carrito desde localStorage");
      setCart([]);
    }
  }, []);

  // Calcular el total del carrito
  useEffect(() => {
    const calculatedTotal = cart.reduce((acc, item) => {
      const itemPrice = parseFloat(item.price) || 0; // Asegura que el precio sea un número válido
      const itemQuantity = item.quantity || 0; // Asegura que la cantidad sea un número válido
      return acc + itemPrice * itemQuantity;
    }, 0);
    setTotal(calculatedTotal);
  }, [cart]); // Este useEffect se ejecuta cada vez que el carrito cambia

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

  // Actualizar la cantidad de un producto
// Actualizar la cantidad de un producto
const handleQuantityChange = (productId, newQuantity) => {
  // Convierte la cantidad a un número entero
  const parsedQuantity = parseInt(newQuantity, 10);

  // Verificar si la cantidad es válida (no NaN) y dentro del rango permitido
  if (isNaN(parsedQuantity) || parsedQuantity < 1) {
    // Si la cantidad es inválida, asignar el valor mínimo de 1
    return;
  }

  // Asegurarse de que cada producto tenga un stock disponible y no modificar si no hay stock
  const updatedCart = cart.map((item) =>
    item.id === productId
      ? {
          ...item,
          quantity: Math.min(parsedQuantity, item.stock || Infinity), // Limitar la cantidad al stock disponible, Infinity si no hay stock
        }
      : item
  );

  // Actualizar el carrito en el estado y en localStorage
  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  // Recalcular el total después de actualizar la cantidad
  const calculatedTotal = updatedCart.reduce((acc, item) => {
    const itemPrice = parseFloat(item.price) || 0; // Asegura que el precio sea un número válido
    const itemQuantity = item.quantity || 0; // Asegura que la cantidad sea un número válido
    return acc + itemPrice * itemQuantity;
  }, 0);

  // Actualizar el total en el estado
  setTotal(calculatedTotal);
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
    return (
      <div className={styles.emptyCart}>
        <h2>Tu carrito está vacío</h2>
        <p>Añade productos para proceder con la compra.</p>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartContent}>
        <h1 className={styles.pageTitle}>Carrito de Compras</h1>
        {cart.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.cartItemImage}>
              <Image
                width={200}
                height={200}
                src={item.image?.[0] || "/default-image.jpg"}
                alt={item.name}
                className={styles.cartImage}
              />
            </div>
            <div className={styles.cartItemDetails}>
              <h2>{item.name}</h2>
              <p className={styles.cartItemPrice}>${item.price}</p>
              <div className={styles.quantityControl}>
                <label>Cantidad:</label>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  max={item.stock}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                  }
                  className={styles.quantityInput}
                />
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className={styles.removeButton}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        <div className={styles.totalContainer}>
          <h3 className={styles.totalText}>Total: ${total}</h3>
        </div>

        <div className={styles.actions}>
          <button onClick={clearCart} className={styles.clearButton}>
            Vaciar carrito
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className={styles.payButton}
          >
            {loading ? "Procesando..." : "Proceder al pago"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
