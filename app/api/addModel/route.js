import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
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
