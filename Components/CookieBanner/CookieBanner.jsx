"use client";

import { useState, useEffect } from "react";
import styles from "./CookieBanner.module.css";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó el uso de cookies
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.cookieBanner}>
      <p>
        Usamos cookies para mejorar la experiencia de nuestro sitio web. Al
        continuar navegando, aceptas su uso.
      </p>
      <button onClick={handleAccept} className={styles.acceptButton}>
        Aceptar
      </button>
    </div>
  );
}
