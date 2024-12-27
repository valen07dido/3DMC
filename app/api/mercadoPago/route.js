import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Verifica si tienes configurado el Access Token
    const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'El Access Token de Mercado Pago no está configurado.' },
        { status: 500 }
      );
    }

    // Obtén los datos del cuerpo de la solicitud
    const body = await request.json();
    if (!body.cart || !Array.isArray(body.cart) || body.cart.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío o no es válido.' },
        { status: 400 }
      );
    }

    // Construir la preferencia
    const preference = {
      items: body.cart.map((item) => ({
        title: item.title,
        unit_price: item.price,
        quantity: item.quantity,
      })),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
      },
      auto_return: 'approved',
    };

    // Llamada a la API de Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al crear la preferencia: ${errorData.message}`);
    }

    const responseData = await response.json();
    return NextResponse.json({ preferenceId: responseData.id });
  } catch (error) {
    console.error('Error al procesar la solicitud de pago:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
