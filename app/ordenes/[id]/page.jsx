"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./page.module.css";
import { usePathname } from "next/navigation";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const id = usePathname().split("/").pop();

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Pasamos el user_id en la query string
        const { data } = await axios.get(`/api/orders?user_id=${id}`, {
          withCredentials: true,
        });
        // Suponemos que el endpoint retorna un array de órdenes o un objeto con la propiedad "orders"
        const ordersData = data.orders ? data.orders : data;
        setOrders(ordersData);
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las órdenes",
        });
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchOrders();
    }
  }, [id]);

  if (loading) {
    return <div className={styles.ordersContainer}>Cargando órdenes...</div>;
  }

  if (!orders.length) {
    return <div className={styles.ordersContainer}>No hay órdenes para mostrar.</div>;
  }

  return (
    <div className={styles.ordersContainer}>
      <h2 className={styles.heading}>Mis Órdenes de Compra</h2>
      <table className={styles.ordersTable}>
        <thead>
          <tr>
            <th>Número de Orden</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha de Creación</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.order_number}</td>
              <td>${order.total}</td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>
                <ul className={styles.itemsList}>
                  {order.items &&
                    Array.isArray(order.items) &&
                    order.items.map((item, index) => (
                      <li key={index}>
                        {item.title} {item.quantity ? `x${item.quantity}` : ""}
                      </li>
                    ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
