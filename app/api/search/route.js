import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("query");

    if (!term) {
      return NextResponse.json(
        { message: "El término de búsqueda es obligatorio." },
        { status: 400 }
      );
    }

    const query = `
      SELECT * 
      FROM "Models" 
      WHERE LOWER(name) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1)
    `;
    const values = [`%${term}%`];

    // Usa sql como plantilla etiquetada
    const { rows } = await sql`
      SELECT * 
      FROM "Models" 
      WHERE LOWER(name) LIKE LOWER(${`%${term}%`}) 
      OR LOWER(description) LIKE LOWER(${`%${term}%`})
    `;

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    return NextResponse.json(
      { message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
