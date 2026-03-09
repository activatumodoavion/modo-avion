"use client";

import { useState } from "react";
import { airports } from "../lib/airports";
import type { Airport } from "../lib/airports";

type Props = {
  onSelect: (code: string) => void;
};

export default function AirportAutocomplete({ onSelect }: Props) {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Airport[]>([]);

  function handleSearch(value: string) {

    setQuery(value);

    const search = value.toLowerCase();

    const filtered = airports.filter((airport) => {
      return (
        airport.city.toLowerCase().includes(search) ||
        airport.code.toLowerCase().includes(search) ||
        airport.name.toLowerCase().includes(search) ||
        airport.country.toLowerCase().includes(search)
      );
    });

    setResults(filtered.slice(0, 5));
  }

  function selectAirport(airport: Airport) {
    setQuery(`${airport.city} (${airport.code})`);
    setResults([]);
    onSelect(airport.code);
  }

  return (
    <div className="relative">

      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Ciudad o aeropuerto"
        className="border p-2 w-full rounded"
      />

      {results.length > 0 && (
        <div className="absolute bg-white border w-full shadow rounded z-50">

          {results.map((airport) => (
            <div
              key={airport.code}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => selectAirport(airport)}
            >
              {airport.city} — {airport.name} ({airport.code})
            </div>
          ))}

        </div>
      )}

    </div>
  );
}