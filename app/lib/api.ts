export async function getFlights() {
  return [
    {
      id: 1,
      origin: "Madrid",
      destination: "Paris",
      price: 120
    },
    {
      id: 2,
      origin: "Buenos Aires",
      destination: "Rio",
      price: 350
    }
  ]
}

export async function getHotels() {
  return [
    {
      id: 1,
      name: "Hotel Central",
      city: "Paris",
      price: 90
    },
    {
      id: 2,
      name: "Beach Resort",
      city: "Rio",
      price: 150
    }
  ]
}