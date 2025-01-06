import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10)); // Asegura que sea al menos 1
    const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "9", 10)); // Asegura que sea al menos 1
    const categoryFilter = url.searchParams.get("category") || "";
    const typeFilter = url.searchParams.get("type") || "";

    const offset = (page - 1) * limit;

    // Query para los productos
    const result = await sql`
      SELECT * FROM "Models"
      WHERE "categories" ILIKE ${`%${categoryFilter}%`} 
      AND "type" ILIKE ${`%${typeFilter}%`}
      LIMIT ${limit} OFFSET ${offset};
    `;

    // Query para el total de productos
    const countResult = await sql`
      SELECT COUNT(*) FROM "Models"
      WHERE "categories" ILIKE ${`%${categoryFilter}%`} 
      AND "type" ILIKE ${`%${typeFilter}%`}
    `;

    const totalItems = parseInt(countResult.rows[0].count, 10); // Base 10
    const totalPages = Math.ceil(totalItems / limit);

    const responseData = {
      products: result.rows,
      page,
      totalPages,
      totalItems,
    };

    const response = NextResponse.json(responseData, { status: 200 });

    // Configura las cabeceras para evitar caché
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Error en la consulta:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
