"use client";
import Image from "next/image";
import styles from "@/Components/NavBar/NavBar.module.css";
import logo from "@/public/logos/logo_horizontal_sin_fondo.png";
import { IoSearchSharp } from "react-icons/io5";
import { PiShoppingCart } from "react-icons/pi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { FiUser } from "react-icons/fi";
import UserLoginModal from "@/Components/UserLoginModal/UserLoginModal";
import UserSidebar from "@/Components/UserSidebar/UserSidebar";
import UserRegisterModal from "@/Components/UserRegisterModal/UserRegisterModal";

const NavBar = () => {
  const pathname = usePathname();
  const [suggestions, setSuggestions] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

  // Función reutilizable para actualizar el estado del usuario
  const updateUserState = () => {
    const token = Cookies.get("authToken");
    if (token) {
      const decoded = parseJwt(token);
      const initial = decoded?.name?.charAt(0).toUpperCase();
      setUserInitial(initial || null);
      setIsLoggedIn(!!initial);
    } else {
      setUserInitial(null);
      setIsLoggedIn(false);
    }
  };
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length > 2) {
      const response = await fetch(`/api/search-suggestions?query=${query}`);
      const data = await response.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };
  // Función para manejar el envío del formulario de búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    router.push(`/search?query=${searchTerm}`);
    setSearchTerm("");
  };

  // Función para manejar el clic en el icono de usuario
  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setShowSidebar(!showSidebar);
    } else {
      setShowLoginModal(true);
    }
  };

  // Decodificador de JWT para obtener datos del token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  // Efecto para obtener el estado del usuario desde las cookies al cargar el componente
  useEffect(() => {
    updateUserState();
  }, []);

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
                pathname === "/productos"
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
                pathname === "/peticiones"
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
                pathname === "/nosotros"
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

          <button className={styles.buttons} onClick={handleUserIconClick}>
            {isLoggedIn && userInitial ? (
              <div className={styles.userInitial}>{userInitial}</div>
            ) : (
              <FiUser className={styles.icon} />
            )}
          </button>
          <Link href="/cart">
            <button className={styles.buttons}>
              <PiShoppingCart className={styles.icon} />
              {cartItems.length > 0 && (
                <span className={styles.cartBadge}>{cartItems.length}</span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Modal para login */}
      {showLoginModal && (
        <UserLoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            updateUserState();
            setShowLoginModal(false);
          }}
        />
      )}

      {/* Modal para registro */}
      {showRegisterModal && (
        <UserRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onRegisterSuccess={() => {
            updateUserState();
            setShowRegisterModal(false);
          }}
        />
      )}

      {/* Sidebar para usuario logueado */}
      {/* Sidebar para usuario logueado */}
      {showSidebar && (
        <UserSidebar
          onClose={() => setShowSidebar(false)}
          onLogout={() => {
            setIsLoggedIn(false);
            setUserInitial(null);
            Cookies.remove("authToken");
          }}
          userRole={parseJwt(Cookies.get("authToken"))?.role}
        />
      )}
    </nav>
  );
};

export default NavBar;
