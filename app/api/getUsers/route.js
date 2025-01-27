import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY || "tu_secreto_super_seguro"; // Cambiar a una variable de entorno

export async function GET(request) {
  try {
    // Obtén el token de las cookies
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Verifica el token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Si el token es válido, continúa con la consulta a la base de datos
    const result = await sql`SELECT id, email, name, rol, created_at FROM "Users"`;

    const response = NextResponse.json(result.rows, { status: 200 });

    // Configura las cabeceras para evitar el caché
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    // Si el error es de JWT, devuelve un error de autorización
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Token inválido o expirado" }, { status: 401 });
    }

    // Maneja otros errores
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
