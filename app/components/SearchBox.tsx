"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTravelStore } from "../lib/travelStore";
import AirportAutocomplete from "./AirportAutocomplete";

type Props = {
  onSearch?: (from: string, to: string, date: string) => void;
};

export default function SearchBox({ onSearch }: Props) {
  const router = useRouter();

  const setDates = useTravelStore((state) => state.setDates);
  const setSearchData = useTravelStore((state) => state.setSearchData);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [rooms, setRooms] = useState(1);

  const [openGuests, setOpenGuests] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        guestsRef.current &&
        !guestsRef.current.contains(event.target as Node)
      ) {
        setOpenGuests(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (departure && returnDate && returnDate <= departure) {
      const nextDay = new Date(departure);
      nextDay.setDate(nextDay.getDate() + 1);
      setReturnDate(nextDay.toISOString().split("T")[0]);
    }
  }, [departure]);

  const calculateNights = () => {
    if (!departure || !returnDate) return 0;
    const start = new Date(departure);
    const end = new Date(returnDate);
    return (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
  };

  useEffect(() => {
    if (children === 0) {
      setChildrenAges([]);
      return;
    }

    if (childrenAges.length < children) {
      setChildrenAges([
        ...childrenAges,
        ...Array(children - childrenAges.length).fill(0),
      ]);
    }

    if (childrenAges.length > children) {
      setChildrenAges(childrenAges.slice(0, children));
    }
  }, [children]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departure || !returnDate) {
      alert("Seleccioná fechas válidas");
      return;
    }

    if (!from || !to) {
      alert("Seleccioná origen y destino");
      return;
    }

    if (from === to) {
      alert("Origen y destino no pueden ser iguales");
      return;
    }

    if (children > 0 && childrenAges.length !== children) {
      alert("Completá la edad de todos los niños");
      return;
    }

    setDates(departure, returnDate);

    setSearchData(
      from,
      to,
      adults,
      children,
      childrenAges,
      rooms
    );

    try {
      const response = await fetch("/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: from,
          destination: to,
          departureDate: departure,
          returnDate: returnDate,
          adults,
          children,
          childrenAges,
          currencyCode: "USD",
          maxResults: 20,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error buscando vuelos");
      }

      router.push(
        `/vuelos?data=${encodeURIComponent(JSON.stringify(data.data))}`
      );

      if (onSearch) {
        onSearch(from, to, departure);
      }

    } catch (error) {
      console.error("Error buscando vuelos:", error);
      alert("Error buscando vuelos. Intentá nuevamente.");
    }
  };

  // Texto del botón de pasajeros
  const getPassengersText = () => {
    const parts = [];
    parts.push(`${adults} adulto${adults !== 1 ? 's' : ''}`);
    if (children > 0) {
      parts.push(`${children} niño${children !== 1 ? 's' : ''}`);
    }
    parts.push(`${rooms} hab.`);
    return parts.join(" · ");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white text-gray-900 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-start">

        {/* ORIGEN */}
        <div className="relative lg:col-span-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">✈️ Origen</label>
          <AirportAutocomplete onSelect={(code: string) => setFrom(code)} />
        </div>

        {/* DESTINO */}
        <div className="relative lg:col-span-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">📍 Destino</label>
          <AirportAutocomplete onSelect={(code: string) => setTo(code)} />
        </div>

        {/* FECHA IDA */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">📅 Ida</label>
          <input
            type="date"
            min={today}
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* FECHA VUELTA */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">📅 Vuelta</label>
          <input
            type="date"
            min={departure || today}
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PASAJEROS */}
        <div className="relative lg:col-span-2" ref={guestsRef}>
          <label className="block text-sm font-medium mb-2 text-gray-700">👥 Pasajeros</label>
          
          <button
            type="button"
            onClick={() => setOpenGuests(!openGuests)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left bg-white hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="text-gray-900">{getPassengersText()}</span>
          </button>

          {openGuests && (
            <div 
              className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-5 w-80 z-[9999]"
              style={{ top: '100%' }}
            >
              {/* Adultos */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">Adultos</div>
                  <div className="text-sm text-gray-500">13+ años</div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => setAdults(Math.max(1, adults - 1))} 
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={adults <= 1}
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold">{adults}</span>
                  <button 
                    type="button" 
                    onClick={() => setAdults(adults + 1)} 
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Niños */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">Niños</div>
                  <div className="text-sm text-gray-500">0-12 años</div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => {
                      const newCount = Math.max(0, children - 1);
                      setChildren(newCount);
                    }}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={children <= 0}
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold">{children}</span>
                  <button 
                    type="button" 
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Edades de niños */}
              {children > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-100 space-y-3">
                  <div className="font-medium text-sm text-gray-700 mb-2">Edades de los niños:</div>
                  {childrenAges.map((age, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Niño {index + 1}</span>
                      <select
                        value={age}
                        onChange={(e) => {
                          const updated = [...childrenAges];
                          updated[index] = Number(e.target.value);
                          setChildrenAges(updated);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[...Array(13)].map((_, i) => (
                          <option key={i} value={i}>
                            {i} {i === 1 ? 'año' : 'años'}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* Habitaciones */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">Habitaciones</div>
                  <div className="text-sm text-gray-500">Para estadía</div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => setRooms(Math.max(1, rooms - 1))} 
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={rooms <= 1}
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold">{rooms}</span>
                  <button 
                    type="button" 
                    onClick={() => setRooms(rooms + 1)} 
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botón cerrar */}
              <button
                type="button"
                onClick={() => setOpenGuests(false)}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Listo
              </button>
            </div>
          )}
        </div>
      </div>

      {calculateNights() > 0 && (
        <p className="mt-4 text-sm text-gray-600">
          {calculateNights()} {calculateNights() === 1 ? 'noche' : 'noches'} seleccionadas
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
        >
          🔍 Buscar vuelos
        </button>
      </div>
    </form>
  );
}