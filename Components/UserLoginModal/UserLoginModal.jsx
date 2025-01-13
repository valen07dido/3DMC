"use client";
import React, { useState } from "react";
import styles from "./UserLoginModal.module.css";

const UserLoginModal = ({ onClose, onLoginSuccess }) => {
  const [showRegisterForm, setShowRegisterForm] = useState(false); // Estado para cambiar entre login y registro

  const handleLogin = () => {
    // Aquí iría tu lógica para autenticar al usuario (puedes usar fetch con tu backend)
    // Simulamos un login exitoso
    setTimeout(() => {
      onLoginSuccess();
    }, 1000);
  };

  const handleRegisterClick = () => {
    setShowRegisterForm(true); // Cambiar al formulario de registro
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        <h2>{showRegisterForm ? "Registrarse" : "Iniciar Sesión"}</h2>

        {/* Animación de transición */}
        <div className={`${styles.formContainer} ${showRegisterForm ? styles.slideLeft : styles.slideRight}`}>
          {/* Formulario de Login */}
          {!showRegisterForm && (
            <div className={styles.loginForm}>
              <input
                type="email"
                placeholder="Correo electrónico"
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Contraseña"
                className={styles.input}
              />
              <button onClick={handleLogin} className={styles.loginButton}>
                Iniciar Sesión
              </button>
              <p>
                ¿No tienes cuenta?{" "}
                <button
                  className={styles.registerLink}
                  onClick={handleRegisterClick}
                >
                  Regístrate
                </button>
              </p>
            </div>
          )}

          {/* Formulario de Registro */}
          {showRegisterForm && (
            <div className={styles.registerForm}>
              <input
                type="text"
                placeholder="Nombre"
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Usuario"
                className={styles.input}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Contraseña"
                className={styles.input}
              />
              <button onClick={handleLogin} className={styles.registerButton}>
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLoginModal;
