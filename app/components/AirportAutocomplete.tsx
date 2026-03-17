"use client";

import { useState, useEffect, useRef } from "react";

type Airport = {
  id: string;
  name: string;
  iataCode: string;
  address: {
    cityName: string;
    countryName: string;
  };
};

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (code: string) => void; // Mantenemos por compatibilidad
  placeholder?: string;
  className?: string;
  label?: string;
};

export default function AirportAutocomplete({ 
  value = "", 
  onChange, 
  onSelect,
  placeholder = "Ciudad o aeropuerto",
  className = "",
  label
}: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Airport[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  // Sincronizar con value externo
  useEffect(() => {
    if (value !== selectedCode && value !== query) {
      setQuery(value);
    }
  }, [value]);

  async function handleSearch(value: string) {
    setQuery(value);
    onChange?.(value);

    if (value.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const url = `/api/airports?keyword=${encodeURIComponent(value)}`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error en fetch:", error);
      setResults([]);
    }
  }

  function selectAirport(airport: Airport) {
    const city = airport.address?.cityName || "";
    const code = airport.iataCode || "";
    const displayValue = `${city} (${code})`;

    setQuery(displayValue);
    setSelectedCode(code);
    setShowResults(false);
    
    onChange?.(displayValue);
    onSelect?.(code);
  }

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-1">
          {label}
        </label>
      )}
      
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />

      {showResults && results.length > 0 && (
        <div 
          className="absolute left-0 right-0 mt-1 bg-white border-2 border-blue-200 shadow-xl rounded-xl overflow-hidden"
          style={{ 
            top: '100%',
            zIndex: 9999,
            maxHeight: '250px',
            overflowY: 'auto'
          }}
        >
          {results.map((airport) => (
            <div
              key={airport.id}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
              onClick={() => selectAirport(airport)}
            >
              <div className="font-semibold text-gray-800">
                {airport.address?.cityName} ({airport.iataCode})
              </div>
              <div className="text-sm text-gray-500">
                {airport.name}, {airport.address?.countryName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}