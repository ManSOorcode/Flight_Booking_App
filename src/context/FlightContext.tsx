import React, { createContext, useState } from "react";
import type { FlightData } from "../types/flightTypes";

interface FlightContextType {
  selectedFlight: FlightData | null;
  setSelectedFlight: (flight: FlightData) => void;
}

const FlightContext = createContext<FlightContextType | undefined>(undefined);

const FlightProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);

  return (
    <FlightContext.Provider value={{ selectedFlight, setSelectedFlight }}>
      {children}
    </FlightContext.Provider>
  );
};

export { FlightProvider, FlightContext };
