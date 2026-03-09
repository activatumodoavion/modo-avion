"use client";

import { useRouter } from "next/navigation";
import { useTravelStore } from "../lib/travelStore";

export default function FlightOfferCard({ flight }: any) {

  const router = useRouter();
  const setFlight = useTravelStore((state) => state.setFlight);

  const handleSelectFlight = () => {
    setFlight(flight);
    router.push("/mi-viaje");
  };

  return (
    <div className="border rounded-xl p-4 mb-4 shadow-sm">

      <div className="flex justify-between items-center">

        <div>

          <p className="font-bold text-lg">
            {flight.from} → {flight.to}
          </p>

          <p className="text-sm text-gray-500">
            Aerolínea: {flight.airline}
          </p>

          <p className="text-sm">
            Salida: {new Date(flight.departure).toLocaleTimeString()}
          </p>

          <p className="text-sm">
            Llegada: {new Date(flight.arrival).toLocaleTimeString()}
          </p>

        </div>

        <div className="text-right">

          <p className="text-xl font-bold">
            {flight.price} {flight.currency}
          </p>

          <button
            onClick={handleSelectFlight}
            className="mt-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Seleccionar vuelo
          </button>

        </div>

      </div>

    </div>
  );
}