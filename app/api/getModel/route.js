import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Extraemos los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10)); // Página, al menos 1
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "9", 10)); // Límite de productos, al menos 1
    const categoryFilter = searchParams.get("category") || ""; // Filtro de categoría
    const typeFilter = searchParams.get("type") || ""; // Filtro de tipo

    const offset = (page - 1) * limit; // Calcular el desplazamiento para la paginación

    // Consulta para obtener los modelos filtrados
    const productsQuery = sql`
      SELECT * FROM "Models"
      WHERE "categories" ILIKE ${`%${categoryFilter}%`} 
      AND "type" ILIKE ${`%${typeFilter}%`}
      LIMIT ${limit} OFFSET ${offset};
    `;

    // Consulta para contar el número total de productos
    const countQuery = sql`
      SELECT COUNT(*) FROM "Models"
      WHERE "categories" ILIKE ${`%${categoryFilter}%`} 
      AND "type" ILIKE ${`%${typeFilter}%`}
    `;

    // Ejecutamos ambas consultas en paralelo
    const [productsResult, countResult] = await Promise.all([productsQuery, countQuery]);

    const totalItems = parseInt(countResult.rows[0].count, 10); // Total de productos
    const totalPages = Math.ceil(totalItems / limit); // Total de páginas

    // Formateamos la respuesta
    const responseData = {
      products: productsResult.rows,
      page,
      totalPages,
      totalItems,
    };

    // Creamos la respuesta JSON
    const response = NextResponse.json(responseData, { status: 200 });

    // Configuramos los encabezados para evitar caché
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Error en la consulta:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
