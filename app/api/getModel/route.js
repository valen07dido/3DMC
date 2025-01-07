// app/api/getModel/route.js
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);  // Obtenemos la URL de la solicitud
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10)); // Página, al menos 1
    const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "9", 10)); // Límite de productos, al menos 1
    const categoryFilter = url.searchParams.get("category") || "";  // Filtro de categoría
    const typeFilter = url.searchParams.get("type") || "";  // Filtro de tipo

    const offset = (page - 1) * limit;

    // Consulta para obtener los productos
    const result = await sql`
      SELECT * FROM "Models"
      WHERE "categories" ILIKE ${`%${categoryFilter}%`} 
      AND "type" ILIKE ${`%${typeFilter}%`}
      LIMIT ${limit} OFFSET ${offset};
    `;

    // Consulta para contar el número total de productos
    const countResult = await sql`
      SELECT COUNT(*) FROM "Models"
      WHERE "categories" ILIKE ${`%${categoryFilter}%`} 
      AND "type" ILIKE ${`%${typeFilter}%`}
    `;

    const totalItems = parseInt(countResult.rows[0].count, 10);  // Total de productos
    const totalPages = Math.ceil(totalItems / limit);  // Total de páginas

    const responseData = {
      products: result.rows,
      page,
      totalPages,
      totalItems,
    };

    const response = NextResponse.json(responseData, { status: 200 });

    // Evita caché
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Error en la consulta:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
