import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Función para verificar el token
async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
}

// Ruta DELETE para eliminar productos
export async function DELETE(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const id = pathname.split("/").pop();

  try {
    // Obtener el token desde las cookies
    const authToken = (await cookies()).get("authToken")?.value;

    // Si no hay token, retornar error
    if (!authToken) {
      return NextResponse.json(
        { error: "No estás autenticado" },
        { status: 401 }
      );
    }

    // Verificar y decodificar el token
    const user = await verifyToken(authToken);

    // Verificar permisos de admin
    if (user.rol !== "admin") {
      return NextResponse.json(
        { error: "No tienes permisos para eliminar productos" },
        { status: 403 }
      );
    }

    // Eliminar el producto de la base de datos
    const query = `DELETE FROM "Models" WHERE id = $1`;
    await sql.query(query, [id]);

    return NextResponse.json({ delete: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}