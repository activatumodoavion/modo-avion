const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;
const BASE_URL = process.env.AMADEUS_BASE_URL;

export async function getAmadeusToken() {
  const response = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
  });

  const data = await response.json();
  return data.access_token;
}

export async function searchFlights(origin: string, destination: string, date: string) {
  const token = await getAmadeusToken();

  const response = await fetch(
    `${BASE_URL}/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data;
}