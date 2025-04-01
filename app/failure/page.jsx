"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function PaymentFailure() {
  const router = useRouter();

  return (
    <div className="container">
      <div className="card">
        <h1>¡Error en el pago!</h1>
        <p>
          Algo salió mal con Mercado Pago. Por favor, intenta nuevamente o ponte en contacto con soporte.
        </p>
        <button className="btn" onClick={() => router.push("/")}>
          Volver al inicio
        </button>
      </div>
      <style jsx>{`
        /* Contenedor principal centrado con fondo degradado */
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #f44336, #ff9800);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          text-align: center;
          padding: 0 20px;
        }

        /* Card con fondo blanco, sombras y animación */
        .card {
          background: #fff;
          border-radius: 10px;
          padding: 2rem;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          max-width: 400px;
          animation: scaleIn 0.8s ease-out;
        }

        h1 {
          margin-bottom: 1rem;
          color: #e53935;
        }

        p {
          margin-bottom: 2rem;
          color: #333;
          line-height: 1.5;
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #e53935;
          color: #fff;
          border-radius: 5px;
          transition: background 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .btn:hover {
          background: #d32f2f;
        }

        /* Animación de aparición */
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
