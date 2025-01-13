"use client";
import Image from "next/image";
import styles from "@/Components/NavBar/NavBar.module.css";
import logo from "@/public/logos/logo_horizontal_sin_fondo.png";
import { IoSearchSharp } from "react-icons/io5";
import { PiShoppingCart } from "react-icons/pi";
import { FiUser } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import UserLoginModal from "@/Components/UserLoginModal/UserLoginModal";
import UserSidebar from "@/Components/UserSidebar/UserSidebar";
import UserRegisterModal from "@/Components/UserRegisterModal/UserRegisterModal";

const NavBar = () => {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario está logueado
  const [showLoginModal, setShowLoginModal] = useState(false); // Mostrar modal de login
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Mostrar modal de registro
  const [showSidebar, setShowSidebar] = useState(false); // Mostrar sidebar
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    router.push(`/search?query=${searchTerm}`);
    setSearchTerm("");
  };

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      // Si está logueado, muestra el sidebar
      setShowSidebar(!showSidebar);
    } else {
      // Si no está logueado, muestra el modal de login
      setShowLoginModal(true);
    }
  };

  return (
    <nav className={styles.containerGlobal}>
      <div className={styles.container}>
        <Link href="/">
          <Image src={logo} className={styles.image} alt="logo" />
        </Link>
        <div className={styles.bar}>
          <Link className={styles.links} href="/productos">
            <div
              className={
                pathname == "/productos"
                  ? styles.navigationActive
                  : styles.navigation
              }
            >
              Productos
            </div>
          </Link>
          <Link className={styles.links} href="/peticiones">
            <div
              className={
                pathname == "/peticiones"
                  ? styles.navigationActive
                  : styles.navigation
              }
            >
              Peticiones
            </div>
          </Link>
          <Link className={styles.links} href="/nosotros">
            <div
              className={
                pathname == "/nosotros"
                  ? styles.navigationActive
                  : styles.navigation
              }
            >
              Nosotros
            </div>
          </Link>
        </div>

        <div className={styles.box3}>
          <div className={styles.searchBox}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className={styles.searchButton}>
                <IoSearchSharp />
              </button>
            </form>
          </div>

          <button
            className={styles.buttons}
            onClick={handleUserIconClick}
          >
            <FiUser className={styles.icon} />
          </button>
          <button className={styles.buttons}>
            <PiShoppingCart className={styles.icon} />
          </button>
        </div>
      </div>

      {/* Modal para login */}
      {showLoginModal && (
        <UserLoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setShowLoginModal(false);
          }}
        >
        </UserLoginModal>
      )}

      {/* Modal para registro */}
      {showRegisterModal && (
        <UserRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onRegisterSuccess={() => {
            setIsLoggedIn(true);
            setShowRegisterModal(false);
          }}
        />
      )}

      {/* Sidebar para usuario logueado */}
      {showSidebar && <UserSidebar onClose={() => setShowSidebar(false)} />}
    </nav>
  );
};

export default NavBar;
