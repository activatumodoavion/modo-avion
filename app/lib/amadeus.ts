const AMADEUS_API_KEY =
  process.env.AMADEUS_API_KEY || "c8yWPRdnrcHRhab5vLkDuGEGwIyXDMAV";

const AMADEUS_API_SECRET =
  process.env.AMADEUS_API_SECRET || "k13xJo2BMngdxtU7";

const BASE_URL =
  process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com";

let accessToken: string | null = null;
let tokenExpiresAt = 0;

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  childrenAges?: number[];
  infants?: number;
  travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  maxPrice?: number;
  nonStop?: boolean;
  currencyCode?: string;
  maxResults?: number;
}

async function getAmadeusToken(): Promise<string> {

  const now = Date.now();

  if (accessToken && now < tokenExpiresAt) {
    return accessToken;
  }

  const response = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error obteniendo token: ${response.status}`);
  }

  const data = await response.json();

  accessToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000 - 60000;

  return accessToken!;
}

export async function searchFlights(params: FlightSearchParams) {

  const token = await getAmadeusToken();

  const queryParams = new URLSearchParams({
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    adults: params.adults.toString(),
  });

  if (params.returnDate) {
    queryParams.append("returnDate", params.returnDate);
  }

  if (params.children && params.children > 0) {
    queryParams.append("children", params.children.toString());
  }

  if (params.infants && params.infants > 0) {
    queryParams.append("infants", params.infants.toString());
  }

  if (params.travelClass) {
    queryParams.append("travelClass", params.travelClass);
  }

  if (params.maxPrice) {
    queryParams.append("maxPrice", params.maxPrice.toString());
  }

  if (params.nonStop) {
    queryParams.append("nonStop", "true");
  }

  if (params.currencyCode) {
    queryParams.append("currencyCode", params.currencyCode);
  }

  if (params.maxResults) {
    queryParams.append("max", params.maxResults.toString());
  }

  const response = await fetch(
    `${BASE_URL}/v2/shopping/flight-offers?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error en búsqueda de vuelos: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();

  return data;
}