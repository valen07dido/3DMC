import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { user_id, items, total } = await request.json();

    if (!user_id || !items || !total) {
      return NextResponse.json(
        { message: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

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

    return NextResponse.json(
      { message: "Orden creada", order: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear la orden:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const status = searchParams.get("status");

    // No convertir userId a número, ya que es un UUID
    const userIdParam = userId || null;
    const statusParam = status || null;

    const result = await sql`
      SELECT * FROM "Orders"
      WHERE 
        (${userIdParam}::uuid IS NULL OR user_id = ${userIdParam}::uuid)
        AND (${statusParam}::text IS NULL OR status = ${statusParam}::text)
      ORDER BY created_at DESC;
    `;

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
