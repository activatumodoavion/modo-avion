import { NextResponse } from "next/server";
import { searchFlights } from "@/app/lib/amadeus";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  if (!from || !to || !date) {
    return NextResponse.json(
      { error: "Missing parameters" },
      { status: 400 }
    );
  }

  try {
    const flights = await searchFlights(from, to, date);

    return NextResponse.json(flights);
  } catch (error: any) {
    console.error("AMADEUS ERROR:", error);

    return NextResponse.json(
      {
        error: "Flight search failed",
        details: error?.message || error
      },
      { status: 500 }
    );
  }
}