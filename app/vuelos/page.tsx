"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FlightOfferCard from "@/app/components/FlightOfferCard";

interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: any[];
  travelerPricings: any[];
}

export default function VuelosPage() {

  const searchParams = useSearchParams();

  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortType, setSortType] = useState("price");
  const [nonStopOnly, setNonStopOnly] = useState(false);

  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [priceLimit, setPriceLimit] = useState<number>(0);

  const [airlines, setAirlines] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);

  const [departureTimeFilter, setDepartureTimeFilter] = useState("all");

  useEffect(() => {

    const dataParam = searchParams.get("data");

    if (dataParam) {

      try {

        const parsedData = JSON.parse(decodeURIComponent(dataParam));

        setOffers(parsedData);
        setFilteredOffers(parsedData);

        const prices = parsedData.map((o: any) => Number(o.price.total));
        const max = Math.max(...prices);

        setMaxPrice(max);
        setPriceLimit(max);

        const carriers = new Set<string>();

        parsedData.forEach((offer: any) => {
          offer.itineraries.forEach((it: any) => {
            it.segments.forEach((seg: any) => {
              carriers.add(seg.carrierCode);
            });
          });
        });

        setAirlines(Array.from(carriers));

      } catch (err) {

        console.error(err);
        setError("Error cargando resultados");

      }

    }

    setLoading(false);

  }, [searchParams]);

  const applyFilters = () => {

    let results = [...offers];

    if (nonStopOnly) {
      results = results.filter((offer) =>
        offer.itineraries.every((it: any) => it.segments.length === 1)
      );
    }

    if (priceLimit) {
      results = results.filter(
        (offer) => Number(offer.price.total) <= priceLimit
      );
    }

    if (selectedAirlines.length > 0) {
      results = results.filter((offer) =>
        offer.itineraries.some((it: any) =>
          it.segments.some((seg: any) =>
            selectedAirlines.includes(seg.carrierCode)
          )
        )
      );
    }

    if (departureTimeFilter !== "all") {

      results = results.filter((offer) => {

        const departure = new Date(
          offer.itineraries[0].segments[0].departure.at
        );

        const hour = departure.getHours();

        if (departureTimeFilter === "morning") return hour >= 5 && hour < 12;
        if (departureTimeFilter === "afternoon") return hour >= 12 && hour < 18;
        if (departureTimeFilter === "night") return hour >= 18 || hour < 5;

        return true;

      });

    }

    if (sortType === "price") {
      results.sort(
        (a, b) =>
          Number(a.price.total) - Number(b.price.total)
      );
    }

    if (sortType === "duration") {
      results.sort(
        (a, b) =>
          a.itineraries[0].duration.localeCompare(
            b.itineraries[0].duration
          )
      );
    }

    setFilteredOffers(results);
  };

  useEffect(() => {
    applyFilters();
  }, [sortType, nonStopOnly, priceLimit, selectedAirlines, departureTimeFilter, offers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <h2 className="text-2xl font-bold mb-3">Error</h2>

          <p className="text-gray-600">{error}</p>

        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-4xl mx-auto px-4">

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Resultados de búsqueda ({filteredOffers.length} vuelos)
        </h1>

        {/* FILTROS */}
        <div className="flex gap-4 mb-6 flex-wrap">

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="price">Más barato</option>
            <option value="duration">Más rápido</option>
          </select>

          <label className="flex items-center gap-2">

            <input
              type="checkbox"
              checked={nonStopOnly}
              onChange={(e) => setNonStopOnly(e.target.checked)}
            />

            Sin escalas

          </label>

          <select
            value={departureTimeFilter}
            onChange={(e) => setDepartureTimeFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">Todos los horarios</option>
            <option value="morning">Mañana (05-12)</option>
            <option value="afternoon">Tarde (12-18)</option>
            <option value="night">Noche (18-05)</option>
          </select>

        </div>

        {/* FILTRO PRECIO */}
        {maxPrice && (
          <div className="mb-8">

            <p className="text-sm text-gray-600 mb-2">
              Precio máximo: {priceLimit} USD
            </p>

            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceLimit}
              onChange={(e) => setPriceLimit(Number(e.target.value))}
              className="w-full"
            />

          </div>
        )}

        {/* FILTRO AEROLÍNEAS */}
        {airlines.length > 0 && (
          <div className="mb-8">

            <p className="text-sm font-semibold mb-2">
              Aerolíneas
            </p>

            <div className="flex flex-wrap gap-3">

              {airlines.map((airline) => (

                <label
                  key={airline}
                  className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer"
                >

                  <input
                    type="checkbox"
                    checked={selectedAirlines.includes(airline)}
                    onChange={(e) => {

                      if (e.target.checked) {
                        setSelectedAirlines([...selectedAirlines, airline]);
                      } else {
                        setSelectedAirlines(
                          selectedAirlines.filter(a => a !== airline)
                        );
                      }

                    }}
                  />

                  {airline}

                </label>

              ))}

            </div>

          </div>
        )}

        {filteredOffers.length === 0 ? (

          <div className="text-center py-16 bg-white rounded-xl shadow">

            <p className="text-gray-500 text-lg">
              No se encontraron vuelos
            </p>

            <p className="text-gray-400 text-sm mt-2">
              Probá otras fechas o destinos
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {filteredOffers.map((offer) => (

              <FlightOfferCard
                key={offer.id}
                offer={offer}
              />

            ))}

          </div>

        )}

      </div>

    </div>

  );
}