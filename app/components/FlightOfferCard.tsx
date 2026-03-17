"use client";

import { getAirlineLogo } from "@/app/lib/airlineLogo";

interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        at: string;
        terminal?: string;
      };
      arrival: {
        iataCode: string;
        at: string;
        terminal?: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      duration: string;
    }>;
  }>;
  travelerPricings: Array<{
    travelerType: string;
    fareDetailsBySegment: Array<{
      cabin: string;
      class: string;
    }>;
  }>;
}

interface Props {
  offer: FlightOffer;
  dictionaries?: {
    carriers?: Record<string, string>;
    aircraft?: Record<string, string>;
    locations?: Record<string, any>;
  };
}

export default function FlightOfferCard({ offer, dictionaries }: Props) {

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const getCarrierName = (code: string) => {
    return dictionaries?.carriers?.[code] || code;
  };

  const getAirportName = (code: string) => {
    return dictionaries?.locations?.[code]?.cityCode || code;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">

      {/* PRECIO */}
      <div className="flex justify-between items-start mb-4">

        <div>
          <span className="text-2xl font-bold text-gray-900">
            {offer.price.total} {offer.price.currency}
          </span>
          <p className="text-sm text-gray-500">
            Precio total
          </p>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
          Seleccionar
        </button>

      </div>

      {/* ITINERARIOS */}
      {offer.itineraries.map((itinerary, idx) => (

        <div key={idx} className="mb-6">

          <div className="flex items-center gap-2 mb-3">

            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {idx === 0 ? "IDA" : "VUELTA"}
            </span>

            <span className="text-gray-500 text-sm">
              {itinerary.duration.replace("PT", "").toLowerCase()}
            </span>

          </div>

          {itinerary.segments.map((segment, segIdx) => (

            <div
              key={segIdx}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-2"
            >

              {/* SALIDA */}
              <div className="text-center">

                <p className="text-lg font-bold">
                  {formatTime(segment.departure.at)}
                </p>

                <p className="text-sm text-gray-600">
                  {getAirportName(segment.departure.iataCode)}
                </p>

                <p className="text-xs text-gray-400">
                  {formatDate(segment.departure.at)}
                </p>

              </div>

              {/* VUELO */}
              <div className="flex-1 text-center">

                <div className="border-t border-gray-300 relative">

                  <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-gray-50 px-2 flex items-center gap-2">

                    <img
                      src={getAirlineLogo(segment.carrierCode)}
                      alt={segment.carrierCode}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://cdn-icons-png.flaticon.com/512/684/684908.png";
                      }}
                    />

                    <span className="text-xs text-gray-500">
                      {getCarrierName(segment.carrierCode)} {segment.number}
                    </span>

                  </div>

                </div>

                {/* DURACIÓN */}
                <p className="text-xs text-gray-400 mt-2">
                  {segment.duration.replace("PT", "").toLowerCase()}
                </p>

                {/* ESCALAS */}
                {segIdx === 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {itinerary.segments.length === 1
                      ? "Directo"
                      : `${itinerary.segments.length - 1} escala(s)`
                    }
                  </p>
                )}

              </div>

              {/* LLEGADA */}
              <div className="text-center">

                <p className="text-lg font-bold">
                  {formatTime(segment.arrival.at)}
                </p>

                <p className="text-sm text-gray-600">
                  {getAirportName(segment.arrival.iataCode)}
                </p>

                <p className="text-xs text-gray-400">
                  {formatDate(segment.arrival.at)}
                </p>

              </div>

            </div>

          ))}

        </div>

      ))}

    </div>
  );
}