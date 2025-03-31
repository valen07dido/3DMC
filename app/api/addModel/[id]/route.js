import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Importamos el manejo de cookies

// Función para verificar el token
async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ahora verifica correctamente
    return decoded; // Retorna el usuario decodificado
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
}

// Ruta PUT para actualizar productos
export async function PUT(request) {
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
        { error: "No tienes permisos para actualizar productos" },
        { status: 403 }
      );
    }

    // Obtener los datos del request
    const {
      name,
      description,
      image,
      categories,
      solutions,
      characteristics,
      carrousel,
      price
    } = await request.json();
    console.log({
      name,
      description,
      image,
      categories,
      solutions,
      characteristics,
      carrousel,
      price
    })

    // Filtrar los campos definidos
    const fieldsToUpdate = {
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(image !== undefined ? { image } : {}),
      ...(categories !== undefined ? { categories } : {}),
      ...(solutions !== undefined ? { solutions } : {}),
      ...(characteristics !== undefined ? { characteristics } : {}),
      ...(typeof carrousel === 'boolean' ? { carrousel } : {}),
      ...(price !== undefined ? { price } : {}),
    };
    
    // Si no hay campos para actualizar, retornar error
    if (Object.keys(fieldsToUpdate).length === 0) {
      return NextResponse.json(
        { error: "No hay campos para actualizar" },
        { status: 400 }
      );
    }

    // Construir consulta SQL dinámicamente
    const setClauses = Object.entries(fieldsToUpdate)
      .map(([key], index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const values = Object.values(fieldsToUpdate);
    const query = `
      UPDATE "Models"
      SET ${setClauses}
      WHERE id = $${values.length + 1}
    `;

    // Ejecutar la consulta en la base de datos
    await sql.query(query, [...values, id]);

    return NextResponse.json({ update: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
