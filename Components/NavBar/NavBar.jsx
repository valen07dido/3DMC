"use client";
import Image from "next/image";
import styles from "@/Components/NavBar/NavBar.module.css";
import logo from "@/public/logos/logo_horizontal_sin_fondo.png";
import { IoSearchSharp } from "react-icons/io5";
import { PiShoppingCart } from "react-icons/pi";
import { FiUser } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    router.push(`/search?query=${searchTerm}`);
    setSearchTerm("");
  };

  const handleRemoveHistory = (term) => {
    const updatedHistory = searchHistory.filter((item) => item !== term);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
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

        <div className={styles.box3}>
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

          <button className={styles.buttons}>
            <FiUser className={styles.icon} />
          </button>
          <button className={styles.buttons}>
            <PiShoppingCart className={styles.icon} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
