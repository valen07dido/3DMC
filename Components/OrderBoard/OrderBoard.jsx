"use client";

import { useEffect, useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import axios from "axios";
import OrderCard from "../OrderCard/OrderCard";
import styles from "./OrderBoard.module.css"; // Importamos el archivo de estilos

export default function OrderBoard() {
  const [orders, setOrders] = useState({
    pendiente: [],
    "en preparación": [],
    entregada: [],
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders");
      const groupedOrders = {
        pendiente: [],
        "en preparación": [],
        entregada: [],
      };
      response.data.forEach((order) => {
        groupedOrders[order.status]?.push(order);
      });
      setOrders(groupedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceColumn = active.data.current?.status;
    const targetColumn = over.data.current?.status;

    if (sourceColumn === targetColumn) return;

    const updatedOrders = { ...orders };
    const orderIndex = updatedOrders[sourceColumn].findIndex(
      (o) => o.id === active.id
    );
    const [movedOrder] = updatedOrders[sourceColumn].splice(orderIndex, 1);
    movedOrder.status = targetColumn;
    updatedOrders[targetColumn].push(movedOrder);

    setOrders(updatedOrders);

    try {
      await axios.put(`/api/orders/${movedOrder.id}`, { status: targetColumn });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        {Object.entries(orders).map(([status, orders]) => (
          <div key={status} className={styles.statusColumn}>
            <h2 className={styles.statusTitle}>{status}</h2>
            <SortableContext items={orders} strategy={verticalListSortingStrategy}>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
