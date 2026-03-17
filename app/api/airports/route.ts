import { NextRequest, NextResponse } from "next/server";

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY!;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET!;

async function getAccessToken() {
  const res = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
    }
  );

  const data = await res.json();
  return data.access_token;
}

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword");

  if (!keyword) {
    return NextResponse.json([]);
  }

  try {
    const token = await getAccessToken();

    // CORREGIDO: eliminé el espacio en "AIRPORT,CITY"
    const res = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(keyword)}&page[limit]=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store"
      }
    );

    const data = await res.json();

    // Normalizar respuesta
    const airports =
      data.data
        ?.filter((item: any) => item.iataCode)
        ?.map((item: any) => ({
          id: item.id,
          name: item.name,
          iataCode: item.iataCode,
          address: {
            cityName: item.address?.cityName,
            countryName: item.address?.countryName,
          },
        })) || [];

    return NextResponse.json(airports);

  } catch (error) {
    console.error("Error buscando aeropuertos", error);
    return NextResponse.json([], { status: 500 });
  }
}