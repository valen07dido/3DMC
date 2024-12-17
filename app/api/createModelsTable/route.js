import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    const result = await sql`
      CREATE TABLE IF NOT EXISTS "Models" (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        Name text,  
        Image text[], 
        Description text,  
        Categories text,  
        Type text,  
        Characteristics text[], 
        Carrousel boolean
      );
    `;
    return NextResponse.json({ result, done: "create" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
