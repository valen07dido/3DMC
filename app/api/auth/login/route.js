import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const SECRET_KEY = "tu_secreto_super_seguro"; // Cambiar a una variable de entorno

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Consulta el usuario en la base de datos
    const result = await sql`SELECT id, email, name, password, rol FROM "Users" WHERE email = ${email}`;
    const user = result.rows[0];

    // Verifica si el usuario existe
    if (!user) {
      return NextResponse.json({ message: "Usuario o contraseña incorrectos" }, { status: 401 });
    }

    // Verifica la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Usuario o contraseña incorrectos" }, { status: 401 });
    }

    // Genera el token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, rol: user.rol },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    // Configura la cookie en la respuesta
    const response = NextResponse.json({ message: "Inicio de sesión exitoso" });
    response.cookies.set("authToken", token, {
      httpOnly: true, // No accesible desde JavaScript
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
      maxAge: 2 * 60 * 60, // 2 horas
      path: "/", // Disponible para toda la aplicación
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
