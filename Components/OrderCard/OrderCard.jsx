import { useDraggable } from "@dnd-kit/core";
import styles from "../OrderBoard/OrderBoard.module.css"; // Importamos los estilos

export default function OrderCard({ order }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order.id,
    data: { status: order.status },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${styles.orderCard} ${isDragging ? styles.dragging : ""}`}
    >
      <h3 className="font-semibold text-gray-800">Order #{order.order_number}</h3>
      <p className="text-sm text-gray-600">Status: {order.status}</p>
      <p className="text-sm text-gray-600">Total: ${order.total}</p>

      <div className={styles.itemList}>
        <h4 className={styles.itemHeader}>Items:</h4>
        {order.items.map((item, index) => (
          <div key={index} className={styles.itemText}>
            <p>{item.producto} - {item.cantidad} x ${item.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
