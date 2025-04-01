"use client";
import React, { useState, useEffect } from "react";
import styles from "@/Components/Footer/Footer.module.css";
import Link from "next/link";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaRegCopyright,
  FaWhatsapp,
} from "react-icons/fa";
import Image from "next/image";
import img from "@/public/logos/3dmc.svg";

const Footer = () => {
  const [whatsappMessage, setWhatsappMessage] = useState("");

  const handleSendMessage = () => {
    const phoneNumber = "543413164761"; // Número de WhatsApp sin el "+"
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainSection}>
        <div className={styles.logoContainer}>
          <Image src={img} width={150} height={150} alt="Logo" />
        </div>

        <div className={styles.linksContainer}>
          <Link href="/productos" className={styles.link}>
            Productos
          </Link>
          <Link href="/peticiones" className={styles.link}>
            Peticiones
          </Link>
          <Link href="/nosotros" className={styles.link}>
            Nosotros
          </Link>
        </div>

        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3349.89179106526!2d-60.74932447614025!3d-32.90102913033302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b6526700e39477%3A0xe30b0af0e4d927b6!2sCondominios%20Pilay%20-%20Palos%20Verdes!5e0!3m2!1ses!2sar!4v1743520186640!5m2!1ses!2sar"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        <div className={styles.whatsappContainer}>
          <h3 className={styles.whatsappTitle}>Envíanos un mensaje</h3>
          <input
            type="text"
            className={styles.whatsappInput}
            placeholder="Escribe tu mensaje..."
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
          />
          <button className={styles.whatsappButton} onClick={handleSendMessage}>
            <FaWhatsapp className={styles.whatsappIcon} /> Enviar
          </button>
        </div>
      </div>

      <div className={styles.socialSection}>
        <div className={styles.icons}>
          <FaYoutube className={styles.icon} />
          <FaFacebook className={styles.icon} />
          <FaInstagram className={styles.icon} />
        </div>
        <div className={styles.line}></div>
      </div>

      <div className={styles.footerBottom}>
        <h3 className={styles.speech}>3DMC Impresiones 3D</h3>
        <h4 className={styles.copyright}>
          <FaRegCopyright /> Derechos reservados 3DMC
        </h4>
      </div>
    </div>
  );
};

export default Footer;
