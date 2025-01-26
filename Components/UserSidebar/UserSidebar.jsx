"use client";
import styles from "./UserSidebar.module.css";
import Cookies from "js-cookie";

const UserSidebar = ({ onClose, onLogout, userRole }) => {
  const handleLogout = () => {
    console.log("handleLogout se ejecutó");
    // Elimina el token de las cookies
    Cookies.remove("authToken");
    console.log("Token eliminado de las cookies");
    // Llama la función pasada por props para actualizar el estado en NavBar
    onLogout();
    console.log("onLogout ejecutado");
    // Cierra el sidebar
    onClose();
    console.log("onClose ejecutado");
  };

  const adminMenu = (
    <ul className={styles.sidebarMenu}>
      <li>Gestión de Usuarios</li>
      <li>Gestión de Productos</li>
      <li>Pedidos Pendientes</li>
      <li onClick={handleLogout}>Cerrar Sesión</li>
    </ul>
  );

  const clientMenu = (
    <ul className={styles.sidebarMenu}>
      <li>Mi Perfil</li>
      <li>Mis Pedidos</li>
      <li onClick={handleLogout}>Cerrar Sesión</li>
    </ul>
  );

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>{userRole === "admin" ? "Panel de Admin" : "Panel de Usuario"}</h2>
        <button onClick={onClose} className={styles.closeButton}>
          X
        </button>
      </div>
      {userRole === "admin" ? adminMenu : clientMenu}
    </div>
  );
};

export default UserSidebar;
