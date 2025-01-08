import mercadopago from "mercadopago";
import { NextResponse } from "next/server";

// Configurar Mercado Pago con tu Access Token
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Preferencia de pago
    const preference = {
      items: body.items, // Productos que envía el frontend
      payer: {
        name: body.payer.name,
        email: body.payer.email,
      },
      back_urls: {
        success: `${process.env.BASE_URL}/success`,
        failure: `${process.env.BASE_URL}/failure`,
        pending: `${process.env.BASE_URL}/pending`,
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);

    return NextResponse.json(
      { init_point: response.body.init_point },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return NextResponse.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    );
  }
}
