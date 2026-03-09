"use client";

import Image from "next/image";
import { hotels } from "../lib/data/hotels";
import { useTravelStore } from "../lib/travelStore";
import { useRouter } from "next/navigation";

export default function HotelsPage() {
  const setHotel = useTravelStore((state) => state.setHotel);
  const router = useRouter();

  const handleSelect = (hotel: any) => {
    setHotel(hotel);
    router.push("/mi-viaje");
  };

  return (
    <div className="pt-28 px-6 pb-16 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-gray-900">
        🏨 Elegí tu hotel
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Imagen */}
            <div className="relative w-full h-64">
              <Image
                src={hotel.image}
                alt={hotel.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Contenido */}
            <div className="p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {hotel.name}
                </h2>

                <p className="text-gray-600 text-sm">
                  {hotel.location}
                </p>

                <div className="text-yellow-400 mt-2">
                  {"★".repeat(hotel.stars)}
                </div>

                <p className="text-lg font-bold mt-3 text-gray-900">
                  ${hotel.pricePerNight}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    / noche
                  </span>
                </p>
              </div>

              <button
                onClick={() => handleSelect(hotel)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Seleccionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}