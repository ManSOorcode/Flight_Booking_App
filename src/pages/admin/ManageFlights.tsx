// ManageFlights.tsx
import React, { useEffect, useState } from "react";
import FlightForm from "../admin/FlightForm";
import FlightTable from "../admin/FlightTable";
import type { FlightData, RawFlightData } from "../../types/flightTypes";

const ManageFlights: React.FC = () => {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [editingFlight, setEditingFlight] = useState<FlightData | null>(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await fetch(
        "https://api.aviationstack.com/v1/flights?access_key=c77da35a43c98b68bbdabed11e725839"
      );
      const result = await response.json();
      const formattedFlights: FlightData[] = result?.data
        ?.slice(0, 10)
        ?.map((f: RawFlightData) => ({
          id: `${f.flight.iata}-${f.flight_date}`,
          from: f.departure.iata || "N/A",
          to: f.arrival.iata || "N/A",
          departure: f.departure.scheduled || new Date().toISOString(),
          arrival: f.arrival.scheduled || new Date().toISOString(),
          airline: f.airline.name || "Unknown",
          price: Math.floor(Math.random() * 4000 + 1500),
          seatsAvailable: 50,
          seatsBooked: Math.floor(Math.random() * 20),
        }));

      setFlights(formattedFlights);
      localStorage.setItem("flights", JSON.stringify(formattedFlights));
    } catch (error) {
      console.error("Failed to fetch flights:", error);
    }
  };

  const saveFlights = (updated: FlightData[]) => {
    setFlights(updated);
    localStorage.setItem("flights", JSON.stringify(updated));
  };

  const handleAddFlight = (flight: FlightData) => {
    const updated = [...flights, flight];
    saveFlights(updated);
  };

  const handleUpdateFlight = (updatedFlight: FlightData) => {
    const updated = flights?.map((f) =>
      f.id === updatedFlight.id ? updatedFlight : f
    );
    saveFlights(updated);
    setEditingFlight(null);
  };

  const handleDelete = (id: string) => {
    const updated = flights.filter((f) => f.id !== id);
    saveFlights(updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Flights</h2>
      <FlightForm
        onSubmit={editingFlight ? handleUpdateFlight : handleAddFlight}
        initialData={editingFlight}
        setEditingFlight={setEditingFlight}
      />
      <FlightTable
        flights={flights}
        onEdit={setEditingFlight}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageFlights;
