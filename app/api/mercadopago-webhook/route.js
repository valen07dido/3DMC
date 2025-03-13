import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(req) {
  try {
    const body = await req.json();

    // Verifica si es una notificación de pago
    if (body.type !== "payment") {
      return NextResponse.json({ message: "No es una notificación de pago" }, { status: 400 });
    }

    const paymentId = body.data.id;

    // Obtener detalles del pago
    const payment = await mercadopago.payment.findById(paymentId);
    
    if (payment.response.status !== "approved") {
      return NextResponse.json({ message: "El pago no está aprobado" }, { status: 400 });
    }

    // Extraer datos necesarios del pago
    const { payer, transaction_amount, external_reference } = payment.response;
    
    // External_reference puede ser el user_id o una referencia a los productos comprados
    const { user_id, items } = JSON.parse(external_reference);

    // Validar datos antes de crear la orden
    if (!user_id || !items) {
      return NextResponse.json({ message: "Faltan datos en la referencia externa" }, { status: 400 });
    }

    // Crear el número de orden
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");

    const { rows } = await sql`
      SELECT COUNT(*) as count FROM "Orders" WHERE created_at::date = CURRENT_DATE;
    `;
    const orderCount = parseInt(rows[0].count) + 1;
    const orderNumber = `ORD-${dateStr}-${orderCount.toString().padStart(3, "0")}`;

    // Insertar la orden en la base de datos
    const result = await sql`
      INSERT INTO "Orders" (order_number, user_id, items, total, status)
      VALUES (${orderNumber}, ${user_id}, ${JSON.stringify(items)}, ${transaction_amount}, 'pendiente')
      RETURNING *;
    `;

    return NextResponse.json({ message: "Orden creada", order: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error en el webhook de Mercado Pago:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
