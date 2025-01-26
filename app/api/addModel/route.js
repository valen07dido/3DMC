import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';  // Importa jwt si estás usando JSON Web Tokens para la autenticación

export async function POST(request) {
  try {
    // Obtener el token desde los encabezados de la solicitud
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "No se proporcionó token de autenticación" }, { status: 401 });
    }

    // Verificar el token y obtener el payload
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);  // Asegúrate de usar la clave secreta correcta
    } catch (error) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
    }

    // Verificar si el usuario tiene el rol adecuado (por ejemplo, 'admin')
    if (user.role !== 'admin') {
      return NextResponse.json({ error: "No tienes permiso para realizar esta acción" }, { status: 403 });
    }

    // Continuar con la creación de producto si el rol es válido
    const data = await request.json();

    if (Array.isArray(data)) {
      const results = await Promise.all(
        data.map(async (item) => {
          const {
            name,
            description,
            image,
            categories,
            type,
            characteristics,
            carrousel,
            price,
          } = item;

          if (
            !name ||
            !description ||
            !image ||
            !categories ||
            !type ||
            !characteristics ||
            !price
          ) {
            throw new Error("Faltan datos en el objeto");
          }

          const existingModels =
            await sql`SELECT * FROM "Models" WHERE "name" = ${name};`;
          if (existingModels.rowCount > 0) {
            return { error: `El modelo ${name} ya existe` };
          }

          const imageArray = `{${image
            .map((img) => `"${img.replace(/"/g, '""')}"`)
            .join(",")}}`;
          const characteristicsArray = `{${characteristics
            .map((char) => `"${char.replace(/"/g, '""')}"`)
            .join(",")}}`;

          await sql`
          INSERT INTO "Models" (name, description, image, categories, type, characteristics, carrousel, price)
          VALUES (
            ${name},
            ${description},
            ${imageArray}, 
            ${categories},
            ${type},
            ${characteristicsArray}, 
            ${carrousel},
            ${price}
          );
        `;
          return { success: `Modelo ${name} creado exitosamente` };
        })
      );

      const errors = results.filter((result) => result.error);
      if (errors.length > 0) {
        return NextResponse.json(errors, { status: 400 });
      }

      return NextResponse.json(results, { status: 200 });
    } else {
      const {
        name,
        description,
        image,
        categories,
        type,
        characteristics,
        carrousel,
        price,
      } = data;

      if (
        !name ||
        !description ||
        !image ||
        !categories ||
        !type ||
        !characteristics
      ) {
        throw new Error("Faltan datos");
      }

      const existingModels =
        await sql`SELECT * FROM "Models" WHERE "name" = ${name};`;
      if (existingModels.rowCount > 0) {
        return NextResponse.json(
          { error: "El modelo ya existe" },
          { status: 400 }
        );
      }

      const imageArray = `{${image
        .map((img) => `"${img.replace(/"/g, '""')}"`)
        .join(",")}}`;
      const characteristicsArray = `{${characteristics
        .map((char) => `"${char.replace(/"/g, '""')}"`)
        .join(",")}}`;

      await sql`
        INSERT INTO "Models" (name, description, image, categories, type, characteristics, carrousel,price)
        VALUES (
          ${name},
          ${description},
          ${imageArray}, 
          ${categories},
          ${type},
          ${characteristicsArray}, 
          ${carrousel}
          ${price}
        );
      `;

      return NextResponse.json(
        { Create: "Modelo creado exitosamente" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
