import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Esta función decodifica y verifica el token
async function verifyToken(token) {
  try {
    // Verifica el token usando tu clave secreta
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
    
    // La información del usuario (como el rol y el id) ahora está disponible en `decoded`
    return decoded; // Retorna el objeto decodificado que contiene la información del usuario
  } catch (error) {
    // Si el token es inválido o expiró, lanza un error
    throw new Error('Token inválido o expirado');
  }
}

// Ejemplo de la ruta PUT para actualizar productos con verificación de rol
export async function PUT(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const id = pathname.split("/").pop();

  try {
    // Obtén el token de la solicitud (por ejemplo, desde las cabeceras)
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    // Verificar si el token está presente
    if (!token) {
      return NextResponse.json({ error: "No se proporcionó el token de autenticación" }, { status: 401 });
    }

    // Decodificar y verificar el token
    const user = await verifyToken(token);
    
    // Verificar si el usuario tiene el rol de admin
    if (user.role !== 'admin') {
      return NextResponse.json({ error: "No tienes permisos suficientes para actualizar productos" }, { status: 403 });
    }

    const {
      name,
      description,
      image,
      categories,
      solutions,
      characteristics,
      carrousel,
    } = await request.json();

    // Construir un objeto con solo los campos definidos
    const fieldsToUpdate = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(categories !== undefined && { categories }),
      ...(solutions !== undefined && { solutions }),
      ...(characteristics !== undefined && { characteristics }),
      ...(carrousel !== undefined && { carrousel }),
    };

    // Verificar si hay campos para actualizar
    if (Object.keys(fieldsToUpdate).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // Construir las cláusulas SET dinámicamente
    const setClauses = Object.entries(fieldsToUpdate)
      .map(([key], index) => `"${key}" = $${index + 1}`)
      .join(", ");

    // Construir los valores para los placeholders
    const values = Object.values(fieldsToUpdate);

    // Construir la consulta completa
    const query = `
      UPDATE "Models"
      SET ${setClauses}
      WHERE id = $${values.length + 1}
    `;

    // Ejecutar la consulta
    await sql.query(query, [...values, id]);

    return NextResponse.json({ update: "ok" }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
