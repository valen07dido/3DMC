"use client";
import styles from "./UserSidebar.module.css";
import Cookies from "js-cookie";
import Link from "next/link"; // Importa Link para manejar navegación en Next.js

const UserSidebar = ({ onClose, onLogout, userRole, id }) => {
  const handleLogout = () => {
    console.log("handleLogout se ejecutó");
    // Elimina el token de las cookies
    Cookies.remove("authToken");
    // Llama la función pasada por props para actualizar el estado en NavBar
    onLogout();
    // Cierra el sidebar
    onClose();
  };

  const adminMenu = (
    <ul className={styles.sidebarMenu}>
      <h1>{`Menú de Administrador (${id})`}</h1>
      <li>
        <Link href={`/admin/users`}>Gestión de Usuarios</Link>
      </li>
      <li>
        <Link href={`/admin/products`}>Gestión de Productos</Link>
      </li>
      <li>
        <Link href={`/admin/orders`}>Pedidos Pendientes</Link>
      </li>
      <li onClick={handleLogout}>Cerrar Sesión</li>
    </ul>
  );

  const clientMenu = (
    <ul className={styles.sidebarMenu}>
      <h1>{`Bienvenido Usuario (${id})`}</h1>
      <li>
        <Link href={`/profile/${id}`}>Mi Perfil</Link>
      </li>
      <li>
        <Link href={`/orders/${id}`}>Mis Pedidos</Link>
      </li>
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
