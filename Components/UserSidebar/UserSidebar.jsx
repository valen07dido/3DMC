"use client";
import styles from "./UserSidebar.module.css";
import Cookies from "js-cookie";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi"; // Importa el ícono para cerrar sesión
import { useRouter } from "next/navigation"; // O bien de "next/router" según tu versión

const UserSidebar = ({ onClose, onLogout, userRole, id }) => {
  const router = useRouter();

  const handleLogout = () => {
    console.log("handleLogout se ejecutó");
    // Elimina el token de las cookies
    Cookies.remove("authToken");
    // Llama la función pasada por props para actualizar el estado en NavBar
    onLogout();
    // Cierra el sidebar
    onClose();
    // Redirige al home
    router.push("/");
  };

  const adminMenu = (
    <ul className={styles.sidebarMenu}>
      <h1>Menú de Administrador</h1>
      <li>
        <Link href={`/admin/usuarios`} onClick={onClose}>
          Gestión de Usuarios
        </Link>
      </li>
      <li>
        <Link href={`/admin/productos`} onClick={onClose}>
          Gestión de Productos
        </Link>
      </li>
      <li>
        <Link href={`/admin/pedidos`} onClick={onClose}>
          Pedidos Pendientes
        </Link>
      </li>
    </ul>
  );

  const clientMenu = (
    <ul className={styles.sidebarMenu}>
      <h1>Bienvenido Usuario</h1>
      <li>
        <Link href={`/profile/${id}`} onClick={onClose}>
          Mi Perfil
        </Link>
      </li>
      <li>
        <Link href={`/orders/${id}`} onClick={onClose}>
          Mis Pedidos
        </Link>
      </li>
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
      
      {/* Botón de cerrar sesión posicionado abajo a la izquierda */}
      <div className={styles.logoutIcon} onClick={handleLogout}>
        <FiLogOut />
      </div>
    </div>
  );
};

export default UserSidebar;
