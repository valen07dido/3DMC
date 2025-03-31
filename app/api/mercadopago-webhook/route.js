// /api/mercadopago-webhook.js
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// Esta función puede reutilizar parte de la lógica de creación de orden que ya tienes.
async function createOrder({ user_id, items, total }) {
  // Obtener la fecha actual en formato YYYYMMDD
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");

  // Contar cuántas órdenes se han creado hoy
  const { rows } = await sql`
    SELECT COUNT(*) as count FROM "Orders"
    WHERE created_at::date = CURRENT_DATE;
  `;
  const orderCount = parseInt(rows[0].count) + 1;
  const orderNumber = `ORD-${dateStr}-${orderCount.toString().padStart(3, "0")}`;

  // Insertar la orden en la base de datos
  const result = await sql`
    INSERT INTO "Orders" (order_number, user_id, items, total)
    VALUES (${orderNumber}, ${user_id}, ${JSON.stringify(items)}, ${total})
    RETURNING *;
  `;
  return result.rows[0];
}

export async function POST(request) {
  try {
    // Recibir la notificación de Mercado Pago
    const notification = await request.json();

    // La estructura de la notificación puede variar.
    // Supongamos que verificamos que se trata de un evento de pago actualizado y que el pago está aprobado.
    if (
      notification.type === "payment" &&
      notification.data &&
      notification.data.status === "approved"
    ) {
      // Es importante enviar información adicional (metadata) al crear la preferencia:
      // Por ejemplo, al crear la preferencia, podrías incluir en el campo "metadata" la información de usuario y items.
      // Luego, en el webhook, puedes extraerlos:
      const user_id = notification.data.metadata?.user_id;
      const items = notification.data.metadata?.items;
      const total = notification.data.amount;
      
      if (!user_id || !items || !total) {
        return NextResponse.json(
          { error: "Faltan datos en la notificación para crear la orden" },
          { status: 400 }
        );
      }

      // Crear la orden en la base de datos:
      const order = await createOrder({ user_id, items, total });

      return NextResponse.json(
        { message: "Orden creada correctamente mediante webhook", order },
        { status: 201 }
      );
    }

    // Si la notificación no es del tipo que esperamos, devolvemos una respuesta genérica:
    return NextResponse.json({ message: "Notificación recibida" });
  } catch (error) {
    console.error("Error en el webhook:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
