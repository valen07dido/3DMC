import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '9', 10);
    const categoryFilter = url.searchParams.get('category') || '';
    const typeFilter = url.searchParams.get('type') || '';
    
    const offset = (page - 1) * limit;

    // Asegúrate de que los nombres de las columnas sean correctos aquí
    const query = sql`
      SELECT * FROM "Models"
      WHERE "categories" ILIKE ${`%${categoryFilter}%`} 
      AND "type" ILIKE ${`%${typeFilter}%`}
      LIMIT ${limit} OFFSET ${offset};
    `;

    const result = await query;

    // Para obtener el total de productos que coinciden con los filtros
    const countQuery = sql`
      SELECT COUNT(*) FROM "Models"
      WHERE "categories" ILIKE ${`%${categoryFilter}%`} 
      AND "type" ILIKE ${`%${typeFilter}%`}
    `;
    const countResult = await countQuery;
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    const responseData = {
      products: result.rows,
      page,
      totalPages,
      totalItems,
    };

    const response = NextResponse.json(responseData, { status: 200 });

    // Configura las cabeceras para la caché
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;

  } catch (error) {
    console.error("Error en la consulta:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
