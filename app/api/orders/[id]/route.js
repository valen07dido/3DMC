import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
export async function PUT(request, { params }) {
    const { id } = params;
    const { status } = await request.json();
  
    if (!id || !status) {
      return NextResponse.json(
        { message: "Faltan datos requeridos", data: { id, status } },
        { status: 400 }
      );
    }
  
    const result = await sql`
      UPDATE "Orders"
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;
  
    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Orden no encontrada" },
        { status: 404 }
      );
    }
  
    return NextResponse.json(
      { message: "Estado de la orden actualizado", order: result.rows[0] },
      { status: 200 }
    );
  }
  