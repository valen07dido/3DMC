import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password, name, username } = await request.json();
    // Validar que todos los campos estén presentes
    if (!email || !password || !name || !username) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El email no tiene un formato válido" },
        { status: 400 }
      );
    }

    // Validar fuerza de la contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Validar que el username no contenga caracteres inválidos (opcional)
    const usernameRegex = /^[a-zA-Z0-9_.-]{3,20}$/; // Permite letras, números, guiones bajos y puntos
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          error:
            "El username solo puede contener letras, números, guiones bajos y puntos, y debe tener entre 3 y 20 caracteres.",
        },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Intentar insertar el usuario en la base de datos
    const result = await sql`
      INSERT INTO "Users" (email, password, name, username)
      VALUES (${email}, ${hashedPassword}, ${name}, ${username})
      RETURNING id, email, name, username, created_at;
    `;

    // Devolver el usuario recién creado
    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error) {
    // Manejar errores específicos
    if (error.code === "23505") {
      // Verificar si el error es por email o username duplicado
      const conflictField = error.detail.includes("email")
        ? "El email ya está en uso"
        : "El username ya está en uso";
      return NextResponse.json({ error: conflictField }, { status: 409 });
    }

    // Manejar errores generales
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
