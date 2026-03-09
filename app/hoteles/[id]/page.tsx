"use client";

import { useParams, useRouter } from "next/navigation";
import { hotels } from "@/app/lib/data/hotels";
import { useTravelStore } from "@/app/lib/travelStore";
import { useState } from "react";

export default function HotelDetail() {
  const { id } = useParams();
  const router = useRouter();
  const setHotel = useTravelStore((state) => state.setHotel);

  const hotel = hotels.find((h) => h.id === id);

  const [roomType, setRoomType] = useState("standard");
  const [board, setBoard] = useState("roomOnly");

  if (!hotel) return <div>Hotel no encontrado</div>;

  const roomPrices = {
    standard: hotel.pricePerNight,
    deluxe: hotel.pricePerNight + 120,
    suite: hotel.pricePerNight + 250,
  };

  const boardPrices = {
    roomOnly: 0,
    breakfast: 40,
    allInclusive: 150,
  };

  const finalPrice =
    roomPrices[roomType as keyof typeof roomPrices] +
    boardPrices[board as keyof typeof boardPrices];

  const handleSelect = () => {
    setHotel({
      ...hotel,
      pricePerNight: finalPrice,
      roomType,
      board,
    });

    router.push("/mi-viaje");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">

        <img
          src={hotel.image}
          alt={hotel.name}
          className="rounded-xl mb-6"
        />

        <h1 className="text-3xl font-bold mb-2">
          {hotel.name}
        </h1>

        <p className="text-gray-600 mb-6">
          {hotel.location} · {hotel.stars} estrellas
        </p>

        {/* Tipo de habitación */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">
            Tipo de habitación
          </h3>

          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe (+$120)</option>
            <option value="suite">Suite (+$250)</option>
          </select>
        </div>

        {/* Régimen */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">
            Régimen
          </h3>

          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="roomOnly">
              Solo alojamiento
            </option>
            <option value="breakfast">
              Desayuno (+$40)
            </option>
            <option value="allInclusive">
              All Inclusive (+$150)
            </option>
          </select>
        </div>

        <div className="text-xl font-bold mb-6">
          Precio final por noche: ${finalPrice}
        </div>

        <button
          onClick={handleSelect}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          Seleccionar habitación
        </button>
      </div>
    </div>
  );
}