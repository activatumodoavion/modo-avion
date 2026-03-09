"use client";

import { create } from "zustand";

type TravelState = {
  selectedFlight: any | null;
  selectedHotel: any | null;

  from: string;
  to: string;
  departure: string;
  returnDate: string;
  nights: number;

  adults: number;
  children: number;
  childrenAges: number[];
  rooms: number;

  setDates: (departure: string, returnDate: string) => void;

  setSearchData: (
    from: string,
    to: string,
    adults: number,
    children: number,
    childrenAges: number[],
    rooms: number
  ) => void;

  setFlight: (flight: any) => void;
  setHotel: (hotel: any) => void;

  clear: () => void;
};

export const useTravelStore = create<TravelState>((set) => ({
  selectedFlight: null,
  selectedHotel: null,

  from: "",
  to: "",
  departure: "",
  returnDate: "",
  nights: 0,

  adults: 2,
  children: 0,
  childrenAges: [],
  rooms: 1,

  setDates: (departure, returnDate) =>
    set({
      departure,
      returnDate,
      nights:
        (new Date(returnDate).getTime() -
          new Date(departure).getTime()) /
        (1000 * 3600 * 24),
    }),

  setSearchData: (
    from,
    to,
    adults,
    children,
    childrenAges,
    rooms
  ) =>
    set({
      from,
      to,
      adults,
      children,
      childrenAges,
      rooms,
    }),

  setFlight: (flight) => set({ selectedFlight: flight }),
  setHotel: (hotel) => set({ selectedHotel: hotel }),

  clear: () =>
    set({
      selectedFlight: null,
      selectedHotel: null,
      from: "",
      to: "",
      departure: "",
      returnDate: "",
      nights: 0,
      adults: 2,
      children: 0,
      childrenAges: [],
      rooms: 1,
    }),
}));