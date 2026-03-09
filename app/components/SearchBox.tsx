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

  const [adults, setAdults] = useState(2);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!departure || !returnDate) {
      alert("Seleccioná fechas válidas");
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

    if (onSearch) {
      onSearch(from, to, departure);
    }

    router.push("/vuelos");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-6xl mx-auto"
    >
      <div className="grid md:grid-cols-6 gap-4 items-end">

        {/* ORIGEN */}
        <div>
          <label className="block text-sm font-medium mb-1">✈️ Origen</label>

          <AirportAutocomplete
            onSelect={(code: string) => setFrom(code)}
          />

        </div>

        {/* DESTINO */}
        <div>
          <label className="block text-sm font-medium mb-1">📍 Destino</label>

          <AirportAutocomplete
            onSelect={(code: string) => setTo(code)}
          />

        </div>

        {/* FECHA IDA */}
        <div>
          <label className="block text-sm font-medium mb-1">📅 Ida</label>
          <input
            type="date"
            min={today}
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* FECHA VUELTA */}
        <div>
          <label className="block text-sm font-medium mb-1">📅 Vuelta</label>
          <input
            type="date"
            min={departure || today}
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* PASAJEROS */}
        <div className="relative col-span-2" ref={guestsRef}>
          <label className="block text-sm font-medium mb-1">
            👥 {adults} adultos · {children} niños · {rooms} hab.
          </label>

          <button
            type="button"
            onClick={() => setOpenGuests(!openGuests)}
            className="w-full border rounded-lg px-4 py-2 text-left bg-white"
          >
            Configurar
          </button>

          {openGuests && (
            <div className="absolute mt-2 bg-white border rounded-xl shadow-xl p-4 w-96 z-50">

              <div className="flex justify-between items-center mb-4">
                <span>Adultos</span>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="px-3 border rounded">-</button>
                  <span>{adults}</span>
                  <button type="button" onClick={() => setAdults(adults + 1)} className="px-3 border rounded">+</button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span>Niños</span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newCount = Math.max(0, children - 1);
                      setChildren(newCount);
                      setChildrenAges(childrenAges.slice(0, newCount));
                    }}
                    className="px-3 border rounded"
                  >
                    -
                  </button>

                  <span>{children}</span>

                  <button
                    type="button"
                    onClick={() => {
                      setChildren(children + 1);
                      setChildrenAges([...childrenAges, 0]);
                    }}
                    className="px-3 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {children > 0 && (
                <div className="space-y-2 mb-4">
                  {childrenAges.map((age, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>Edad niño {index + 1}</span>

                      <select
                        value={age}
                        onChange={(e) => {
                          const updated = [...childrenAges];
                          updated[index] = Number(e.target.value);
                          setChildrenAges(updated);
                        }}
                        className="border rounded px-2 py-1"
                      >
                        {[...Array(18)].map((_, i) => (
                          <option key={i} value={i}>
                            {i} años
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Habitaciones</span>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setRooms(Math.max(1, rooms - 1))} className="px-3 border rounded">-</button>
                  <span>{rooms}</span>
                  <button type="button" onClick={() => setRooms(rooms + 1)} className="px-3 border rounded">+</button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {calculateNights() > 0 && (
        <p className="mt-4 text-sm text-gray-600">
          {calculateNights()} noches seleccionadas
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="bg-black text-white px-8 py-3 rounded-xl font-semibold"
        >
          Buscar
        </button>
      </div>

    </form>
  );
}