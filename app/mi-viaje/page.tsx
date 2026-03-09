"use client";

import { useRouter } from "next/navigation";
import { useTravelStore } from "../lib/travelStore";

export default function MiViaje() {
  const router = useRouter();

  const {
    selectedFlight,
    selectedHotel,
    nights,
    clear,
  } = useTravelStore();

  const hotelTotal =
    selectedHotel ? selectedHotel.pricePerNight * nights : 0;

  const total =
    (selectedFlight?.price || 0) + hotelTotal;

  const handleCheckout = () => {
    if (!selectedFlight || !selectedHotel) {
      alert("Seleccioná vuelo y hotel");
      return;
    }

    alert("🎉 Compra realizada con éxito");

    clear();

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl">

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          ✈️ Tu viaje
        </h1>

        {selectedFlight && (
          <>
            <h3 className="text-lg font-semibold text-gray-800">
              Vuelo
            </h3>
            <p className="text-gray-700 mb-4">
              {selectedFlight.from} → {selectedFlight.to} | $
              {selectedFlight.price}
            </p>
          </>
        )}

        {selectedHotel && (
          <>
            <h3 className="text-lg font-semibold text-gray-800">
              Hotel
            </h3>
            <p className="text-gray-700">
              {selectedHotel.name} | $
              {selectedHotel.pricePerNight} / noche
            </p>
            <p className="text-gray-700 mb-4">
              {nights} noches = ${hotelTotal}
            </p>
          </>
        )}

        <hr className="my-6" />

        <h2 className="text-2xl font-bold text-gray-900">
          Total: ${total}
        </h2>

        <button
          disabled={!selectedFlight || !selectedHotel}
          onClick={handleCheckout}
          className="w-full mt-6 bg-black text-white py-3 rounded-xl disabled:opacity-50"
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}