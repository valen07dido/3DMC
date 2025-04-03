"use client";
import React, { useState } from "react";
import styles from "./UserLoginModal.module.css";

const UserLoginModal = ({ onClose, onLoginSuccess }) => {
  const [showRegisterForm, setShowRegisterForm] = useState(false); // Alternar entre login y registro
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Maneja el inicio de sesión
  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Asegura que las cookies se incluyan
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password,
        }),
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        onLoginSuccess(result.user); // Pasar el usuario logueado al componente padre
        onClose(); // Cerrar el modal
      } else {
        setErrorMessage(result.message || "Error al iniciar sesión");
      }
    } catch (error) {
      setErrorMessage("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Maneja el registro de usuarios
  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          username: formData.username,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setShowRegisterForm(false); // Cambiar al formulario de login tras registro exitoso
      } else {
        setErrorMessage(result.error || "Error al registrarse");
      }
    } catch (error) {
      setErrorMessage("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        <h2>{showRegisterForm ? "Registrarse" : "Iniciar Sesión"}</h2>

        {/* Mostrar mensaje de error */}
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        {/* Mostrar estado de carga */}
        {loading && <p className={styles.loading}>Cargando...</p>}

        <div
          className={`${styles.formContainer} ${
            showRegisterForm ? styles.slideLeft : styles.slideRight
          }`}
        >
          {/* Formulario de Login */}
          {!showRegisterForm && (
            <div className={styles.loginForm}>
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico o usuario"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
              />
              <button
                onClick={handleLogin}
                className={styles.loginButton}
                disabled={loading}
              >
                Iniciar Sesión
              </button>
              <p>
                ¿No tienes cuenta?{" "}
                <button
                  className={styles.registerLink}
                  onClick={() => setShowRegisterForm(true)}
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
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                value={formData.username}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
              />
              <button
                onClick={handleRegister}
                className={styles.registerButton}
                disabled={loading}
              >
                Registrarse
              </button>
              <p>
                ¿Ya tienes cuenta?{" "}
                <button
                  className={styles.registerLink}
                  onClick={() => setShowRegisterForm(false)}
                >
                  Inicia Sesión
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLoginModal;
