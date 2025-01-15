import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Obtiene los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("query");

    // Valida el término de búsqueda
    if (!term) {
      return NextResponse.json(
        { message: "El término de búsqueda es obligatorio." },
        { status: 400 }
      );
    }

    // Ejecuta la consulta con parámetros
    const { rows } = await sql`
      SELECT * 
      FROM "Models" 
      WHERE LOWER(name) LIKE ${`%${term.toLowerCase()}%`} 
      OR LOWER(description) LIKE ${`%${term.toLowerCase()}%`}
    `;

    // Responde con los resultados
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error en la búsqueda:", error.message);
    return NextResponse.json(
      { message: "Error interno del servidor.", error: error.message },
      { status: 500 }
    );
  }
}
