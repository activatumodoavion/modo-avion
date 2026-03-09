"use client";

import { useEffect, useState } from "react";
import FlightOfferCard from "../components/FlightOfferCard";
import { useTravelStore } from "../lib/travelStore";

export default function VuelosPage() {

  const { from, to, date } = useTravelStore();

  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    async function loadFlights() {

      if (!from || !to || !date) return;

      setLoading(true);

      const res = await fetch(
        `/api/flights?from=${from}&to=${to}&date=${date}`
      );

      const data = await res.json();

      setFlights(data);

      setLoading(false);
    }

    loadFlights();

  }, [from, to, date]);

  return (

    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        ✈️ Seleccioná tu vuelo
      </h1>

      {loading && <p>Buscando vuelos...</p>}

      {!loading && flights.length === 0 && (
        <p>No se encontraron vuelos.</p>
      )}

      {flights.map((flight) => (
        <FlightOfferCard
          key={flight.id}
          flight={flight}
        />
      ))}

    </div>

  );
}