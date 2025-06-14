import React, { useEffect, useState } from "react";
import FlightForm from "../admin/FlightForm";
import FlightTable from "../admin/FlightTable";
import type { FlightData } from "../../types/flightTypes";

const ManageFlights: React.FC = () => {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [editingFlight, setEditingFlight] = useState<FlightData | null>(null);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      const storedFlights = localStorage.getItem("flights");

      if (storedFlights) {
        const parsedFlights: FlightData[] = JSON.parse(storedFlights);
        setFlights(parsedFlights);
      } else {
        const response = await fetch("../../../public/mock_flights.json");
        const result: FlightData[] = await response.json();
        setFlights(result);
        localStorage.setItem("flights", JSON.stringify(result));
      }
    } catch (error) {
      console.error("Failed to load flights:", error);
    }
  };

  console.log(flights);

  const saveFlights = (updated: FlightData[]) => {
    setFlights(updated);
    localStorage.setItem("flights", JSON.stringify(updated));
  };

  const handleAddFlight = (flight: FlightData) => {
    console.log(flight);
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
    <div className="min-h-screen bg-gray-50 pt-4 md:pt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manage Flights
        </h1>
        <p className="text-gray-600">View and creat new flight</p>
      </div>
      <FlightForm
        onSubmit={editingFlight ? handleUpdateFlight : handleAddFlight}
        initialData={editingFlight || {}}
        isUpdate={editingFlight ? true : false}
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
