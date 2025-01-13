"use client";
import styles from "./UserSidebar.module.css";

const UserSidebar = ({ onClose }) => {
  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log("Cerrando sesión...");
    onClose();
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Panel de Usuario</h2>
        <button onClick={onClose} className={styles.closeButton}>
          X
        </button>
      </div>
      <ul className={styles.sidebarMenu}>
        <li>Mi Perfil</li>
        <li>Mis Pedidos</li>
        <li onClick={handleLogout}>Cerrar Sesión</li>
      </ul>
    </div>
  );
};

export default UserSidebar;
