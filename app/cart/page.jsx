"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

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

  useEffect(() => {
    const calculatedTotal = cart.reduce((acc, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = item.quantity || 0;
      return acc + itemPrice * itemQuantity;
    }, 0);
    setTotal(calculatedTotal);
  }, [cart]);

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: Math.min(parsedQuantity, item.stock || Infinity),
          }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const generateWhatsAppMessage = () => {
    let message = "Hola! Vi tus productos y quisiera:%0A";
    cart.forEach((item) => {
      message += `-${item.quantity}un ${item.name} x $${item.price * item.quantity}%0A`;
    });
    message += "%0AEspero tus datos para realizar la transferencia!!";
    return message;
  };

  const handleWhatsAppPayment = () => {
    const phoneNumber = "+5493415077065"; // Reemplaza con el número de WhatsApp del negocio
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

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
          <a
            href="#"
            onClick={handleWhatsAppPayment}
            className={styles.payButton}
          >
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default CartPage;