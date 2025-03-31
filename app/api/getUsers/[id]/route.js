import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    // Obtén el token de las cookies.
    const token = request.cookies.get("authToken")?.value;
    console.log(token)
    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Verifica el token
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded)
    // Supongamos que el token contiene el ID del usuario en decoded.id
    const result = await sql`
      SELECT id, email, name, username, rol, created_at 
      FROM "Users"
      WHERE id = ${decoded.id}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    const user = result.rows[0];
    const response = NextResponse.json(user, { status: 200 });

    // Configurar las cabeceras para evitar cacheo
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error(error);
    // Si el error proviene del token, devolvemos un error de autorización
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Token inválido o expirado" }, { status: 401 });
    }
    // Otros errores
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
