import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = "tu_secreto_super_seguro"; // Cambiar a una variable de entorno

export async function GET(request) {
  try {
    // Obtén el token de las cookies
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Verifica el token
    const decoded = jwt.verify(token, SECRET_KEY);

    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Token inválido o expirado" }, { status: 401 });
  }
}
