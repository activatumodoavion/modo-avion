import { NextRequest, NextResponse } from "next/server";
import { searchFlights, FlightSearchParams } from "@/app/lib/amadeus";

function normalizeIata(code: string) {
  return code.trim().toUpperCase();
}

function isValidDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let {
      origin,
      destination,
      departureDate,
      returnDate,
      adults = 1,
      children = 0,
      childrenAges = [],
      travelClass,
      maxPrice,
      nonStop,
      currencyCode = "USD",
      maxResults = 20,
    } = body;

    if (!origin || !destination || !departureDate) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: origin, destination, departureDate" },
        { status: 400 }
      );
    }

    if (!isValidDate(departureDate)) {
      return NextResponse.json(
        { error: "Formato de fecha inválido. Usar YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const originCode = normalizeIata(origin);
    const destinationCode = normalizeIata(destination);

    adults = Number(adults) || 1;
    children = Number(children) || 0;

    const infants = childrenAges.filter((age: number) => age <= 1).length;
    const childrenCount = children - infants;

    const searchParams: FlightSearchParams = {
      origin: originCode,
      destination: destinationCode,
      departureDate,
      returnDate: returnDate || undefined,
      adults,
      children: childrenCount > 0 ? childrenCount : undefined,
      infants: infants > 0 ? infants : undefined,
      travelClass,
      maxPrice,
      nonStop,
      currencyCode,
      maxResults: Math.min(Number(maxResults) || 20, 50),
    };

    const results = await searchFlights(searchParams);

    return NextResponse.json({
      success: true,
      data: results?.data || [],
      dictionaries: results?.dictionaries || {},
      meta: results?.meta || {},
    });

  } catch (error: any) {
    console.error("Error en API de vuelos:", error);

    return NextResponse.json(
      { error: error?.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}


// GET para pruebas rápidas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const departureDate = searchParams.get("departureDate");
    const returnDate = searchParams.get("returnDate");

    const adults = Number(searchParams.get("adults")) || 1;

    if (!origin || !destination || !departureDate) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos" },
        { status: 400 }
      );
    }

    if (!isValidDate(departureDate)) {
      return NextResponse.json(
        { error: "Formato de fecha inválido. Usar YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const results = await searchFlights({
      origin: normalizeIata(origin),
      destination: normalizeIata(destination),
      departureDate,
      returnDate: returnDate || undefined,
      adults,
      maxResults: 10,
    });

    return NextResponse.json({
      success: true,
      data: results?.data || [],
      dictionaries: results?.dictionaries || {},
      meta: results?.meta || {},
    });

  } catch (error: any) {
    console.error("Error en GET vuelos:", error);

    return NextResponse.json(
      { error: error?.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}