import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET; // Usa una variable de entorno

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validación de entrada
    if (!email || !password) {
      return NextResponse.json({ message: "Faltan datos requeridos" }, { status: 400 });
    }

    // Consulta el usuario en la base de datos
    const result = await sql`SELECT id, email, name, password, rol FROM "Users" WHERE email = ${email}`;
    const user = result.rows[0];

    // Verifica si el usuario existe
    if (!user) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    // Verifica la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
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
      sameSite: "lax", // Evita problemas con peticiones cruzadas
    });

    return response;
  } catch (error) {
    console.error("Error en el login:", error.message);
    return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
  }
}
