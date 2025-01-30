import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await sql`
CREATE TABLE IF NOT EXISTS "Orders" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL, -- Número de orden personalizado
  user_id UUID REFERENCES "Users"(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pendiente', 'en preparación', 'entregada')) DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    
    `;

    return NextResponse.json(
      { message: "Tabla Orders creada" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear la tabla Orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
