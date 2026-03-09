export type Hotel = {
  id: string;
  name: string;
  location: string;
  stars: number;
  pricePerNight: number;
  image: string;
};

export const hotels: Hotel[] = [
  {
    id: "HT-001",
    name: "Hard Rock Hotel Cancún",
    location: "Cancún, México",
    stars: 5,
    pricePerNight: 450,
    image:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  },
  {
    id: "HT-002",
    name: "Fontainebleau Miami Beach",
    location: "Miami, Estados Unidos",
    stars: 5,
    pricePerNight: 520,
    image:
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
  },
  {
    id: "HT-003",
    name: "Hotel Riu Plaza Madrid",
    location: "Madrid, España",
    stars: 4,
    pricePerNight: 280,
    image:
      "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
  },
  {
    id: "HT-004",
    name: "NH Collection Córdoba",
    location: "Córdoba, Argentina",
    stars: 4,
    pricePerNight: 190,
    image:
      "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
  },
];