"use client";
import Image from "next/image";
import styles from "@/Components/NavBar/NavBar.module.css";
import logo from "@/public/logos/logo_horizontal_sin_fondo.png";
import { IoSearchSharp } from "react-icons/io5";
import { GoMail } from "react-icons/go";
import { PiShoppingCart } from "react-icons/pi";
import { FiUser } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import Link from "next/link";
import { useState, useEffect } from "react";
import Carousel from "../Carousel/Carousel";
import GridProduct from "../GridProduct/GridProduct";

const NavBar = () => {
  const pathname = usePathname();
  const [activePanel, setActivePanel] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <div className={styles.box3}>
            <div>
              <button className={styles.buttons}>
                <IoSearchSharp className={styles.icon} />
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
