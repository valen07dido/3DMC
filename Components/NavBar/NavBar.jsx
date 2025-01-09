"use client";
import Image from "next/image";
import styles from "@/Components/NavBar/NavBar.module.css";
import logo from "@/public/logos/logo_horizontal_sin_fondo.png";
import { IoSearchSharp, IoCloseSharp } from "react-icons/io5";
import { GoMail } from "react-icons/go";
import { PiShoppingCart } from "react-icons/pi";
import { FiUser } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import Link from "next/link";
import { useState, useEffect } from "react";
import Carousel from "../Carousel/Carousel";
import GridProduct from "../GridProduct/GridProduct";
import { useRouter } from "next/navigation";
const NavBar = () => {
  const pathname = usePathname();
  const [activePanel, setActivePanel] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const router=useRouter()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePanelToggle = (name) => {
    setActivePanel(name === activePanel ? null : name);
  };

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(savedHistory);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    // Verificar si el término de búsqueda ya está en el historial
    if (!searchHistory.includes(searchTerm)) {
      const updatedHistory = [searchTerm, ...searchHistory].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    }
    router.push(`/search?query=${searchTerm}`)
    setSearchTerm("");
    setSearch(false); // Cambiado de setIsSearchVisible
  };

  const handleRemoveHistory = (term) => {
    const updatedHistory = searchHistory.filter((item) => item !== term);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!isMobile) {
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
                onMouseEnter={() => handlePanelToggle("productos")}
                onMouseLeave={() => handlePanelToggle("productos")}
              >
                Productos
                {activePanel === "productos" && (
                  <div className={styles.hidden}>
                    <h1 className={styles.title}>Productos</h1>
                    <GridProduct />
                  </div>
                )}
              </div>
            </Link>
            <Link className={styles.links} href="/peticiones">
              <div
                className={
                  pathname == "/peticiones"
                    ? styles.navigationActive
                    : styles.navigation
                }
                onMouseEnter={() => handlePanelToggle("peticiones")}
                onMouseLeave={() => handlePanelToggle("peticiones")}
              >
                Peticiones
                {activePanel === "soporte" && (
                  <div className={styles.hidden}>
                    <h1 className={styles.title}>Soporte</h1>
                  </div>
                )}
              </div>
            </Link>
            <Link className={styles.links} href="/nosotros">
              <div
                className={
                  pathname == "/nosotros"
                    ? styles.navigationActive
                    : styles.navigation
                }
                onMouseEnter={() => handlePanelToggle("nosotros")}
                onMouseLeave={() => handlePanelToggle("nosotros")}
              >
                Nosotros
                {activePanel === "nosotros" && (
                  <div className={styles.hidden}>
                    <h1 className={styles.title}>Nosotros</h1>
                  </div>
                )}
              </div>
            </Link>
            <Link href="/noticias" className={styles.links}>
              <div
                className={
                  pathname == "/noticias"
                    ? styles.navigationActive
                    : styles.navigation
                }
              >
                Noticias
              </div>
            </Link>
          </div>
          {search && (
            <div className={styles.searchBox}>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              <ul className={styles.searchHistory}>
                {searchHistory.map((term, index) => (
                  <li key={index}>
                    <span onClick={() => setSearchTerm(term)}>{term}</span>
                    <span
                      className={styles.removeHistory}
                      onClick={() => handleRemoveHistory(term)}
                    >
                      X
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={styles.box3}>
            <div>
              <button
                className={styles.buttons}
                onClick={() => setSearch(!search)} // Cambia el estado de la búsqueda al hacer clic
              >
                {search ? (
                  <IoCloseSharp className={styles.icon} />
                ) : (
                  <IoSearchSharp className={styles.icon} />
                )}
              </button>
              <button className={styles.buttons}>
                <FiUser className={styles.icon} />
              </button>
              <button className={styles.buttons}>
                <PiShoppingCart className={styles.icon} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className={styles.containerGlobal}>
        <div className={styles.container}>
          <Link href="/">
            <Image src={logo} className={styles.image} alt="logo" />
          </Link>
          <div>
            <button className={styles.buttons}>
              <IoSearchSharp className={styles.icon} />
            </button>
            <button className={styles.buttons}>
              <IoIosMenu className={styles.icon} />
            </button>
          </div>
        </div>
      </nav>
    );
  }
};

export default NavBar;
