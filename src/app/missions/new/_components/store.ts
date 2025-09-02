// File: src/app/missions/new/_components/store.ts

import { create } from 'zustand';

// Define the structure of the flight path data
interface FlightPathState {
  flightPath: object | null;
  setFlightPath: (path: object | null) => void;
}

// Create the store
export const useMissionStore = create<FlightPathState>((set) => ({
  flightPath: null,
  setFlightPath: (path) => set({ flightPath: path }),
}));