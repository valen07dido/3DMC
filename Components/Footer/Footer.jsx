"use client";
import React, { useState, useEffect } from "react";
import styles from "@/Components/Footer/Footer.module.css";
import Link from "next/link";
import logo from "@/public/logos/3dmc.png";
import {
  FaFacebook,
  FaYoutube,
  FaLinkedin,
  FaInstagram,
  FaRegCopyright,
} from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenCompany, setIsOpenCompany] = useState(false);
  const [isOpenMexico, setIsOpenMexico] = useState(false);

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

  const handleOpen = (e) => {
    if (e.target.id === "Company") {
      setIsOpenCompany(!isOpenCompany);
    } else if (e.target.id === "Mexico") {
      setIsOpenMexico(!isOpenMexico);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chest}>

      </div>

      <div className={styles.chest2}>
        <div className={styles.icons}>
          <FaYoutube className={styles.icon} />
          <FaFacebook className={styles.icon} />
          <FaInstagram className={styles.icon} />
        </div>

        <div className={styles.line}></div>
      </div>

      {/* <div className={styles.navbar2}>
        <p className={styles.componentNav}>Preguntas Frecuentes</p>
        <p className={styles.componentNav}>Políticas de privacidad</p>
        <p className={styles.componentNav}>Políticas de devolución</p>
        <p className={styles.componentNav}>Términos y condiciones</p>
      </div> */}

      <div className={styles.chest3}>
        <div className={styles.Box1}>
          <h3 className={styles.speach}>3DMC impresiones 3D</h3>
        </div>

        <div className={styles.Box2}>
          <h4 className={styles.copyright}>
            <FaRegCopyright /> Derechos reservados 3DMC
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Footer;
