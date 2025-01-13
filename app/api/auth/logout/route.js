import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Cierre de sesión exitoso" });

  // Elimina la cookie configurándola con maxAge: 0
  response.cookies.set("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return response;
}
