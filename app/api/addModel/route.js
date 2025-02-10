import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import cloudinary from "cloudinary";

// Configuración de Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Función para subir imágenes a Cloudinary
async function uploadImages(images, folderName) {
  try {
    console.log("Iniciando la subida de imágenes a Cloudinary...");

    const uploadPromises = images.map((imageBase64) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: `models/${folderName}` },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        const buffer = Buffer.from(imageBase64.split(",")[1], "base64");
        uploadStream.end(buffer);
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);
    console.log("Imágenes subidas:", uploadedImages);
    return uploadedImages;
  } catch (error) {
    console.error("Error subiendo imágenes a Cloudinary:", error);
    throw new Error("Error subiendo imágenes a Cloudinary");
  }
}

export async function POST(request) {
  try {
    console.log("Inicio del manejo de la solicitud POST...");
    // Obtener el token desde las cookies
    const token = (await cookies()).get("authToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "No se proporcionó token de autenticación" }, { status: 401 });
    }

    // Verificar el token y obtener el usuario
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
    }

    // Verificar permisos de usuario
    if (user.rol !== "admin") {
      return NextResponse.json({ error: "No tienes permiso para realizar esta acción" }, { status: 403 });
    }

    console.log("Permisos verificados. Obteniendo datos del formulario...");

    // Obtener los datos de la solicitud como JSON
    const data = await request.json();
    const { name, description, images, categories, type, characteristics, carrousel, price } = data;

    console.log("Datos del formulario obtenidos:", { name, description, images, categories, type, characteristics, carrousel, price });

    // Validación de campos requeridos
    if (!name || !description || images.length === 0 || !categories || !type || !characteristics || !price) {
      console.log("Validación fallida. Faltan datos obligatorios:", {
        name: !!name,
        description: !!description,
        images: images.length > 0,
        categories: !!categories,
        type: !!type,
        characteristics: !!characteristics,
        price: !!price,
      });
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    // Verificar si el modelo ya existe
    const existingModel = await sql`SELECT * FROM "Models" WHERE "name" = ${name};`;
    if (existingModel.rowCount > 0) {
      console.log("existe")
      return NextResponse.json({ error: "El modelo ya existe" }, { status: 400 });
    }

    console.log("El modelo no existe. Subiendo imágenes...");

    // Subir imágenes a Cloudinary
    const imageUrls = await uploadImages(images, name);
    console.log("URLs de las imágenes subidas:", imageUrls);

    // Asegurarse de que characteristics es un array
    const characteristicsArray = Array.isArray(characteristics)
      ? characteristics
      : [characteristics];

    const imageArray = `{${imageUrls.map((img) => `"${img.replace(/"/g, '""')}"`).join(",")}}`;
    const formattedCharacteristicsArray = `{${characteristicsArray.map((char) => `"${char.replace(/"/g, '""')}"`).join(",")}}`;

    // Insertar en la base de datos
    await sql`
      INSERT INTO "Models" (name, description, image, categories, type, characteristics, carrousel, price)
      VALUES (
        ${name},
        ${description},
        ${imageArray},
        ${categories},
        ${type},
        ${formattedCharacteristicsArray},
        ${carrousel},
        ${price}
      );
    `;

    console.log("Modelo creado exitosamente.");
    return NextResponse.json({ success: "Modelo creado exitosamente" }, { status: 201 });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
