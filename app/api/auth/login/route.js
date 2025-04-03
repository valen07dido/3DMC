import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET; // Usa una variable de entorno

export async function POST(request) {
  try {
    const { identifier, password } = await request.json();
    console.log(identifier,password)
    // Validación de entrada
    if (!identifier || !password) {
      return NextResponse.json({ message: "Faltan datos requeridos" }, { status: 400 });
    }

    // Buscar usuario por email o username
    const result = await sql`
      SELECT id, email, username, name, password, rol 
      FROM "Users" 
      WHERE email = ${identifier} OR username = ${identifier}`;

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
      { id: user.id, email: user.email, username: user.username, name: user.name, rol: user.rol },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    // Configura la cookie en la respuesta
    const response = NextResponse.json({ message: "Inicio de sesión exitoso" });
    response.cookies.set("authToken", token, {
      httpOnly: false, // Solo accesible en el servidor
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60, // 2 horas
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error en el login:", error.message);
    return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
  }
}
