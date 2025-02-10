import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "../OrderBoard/OrderBoard.module.css";

export default function OrderCard({ order }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: order.id,
      data: { status: order.status },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
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
