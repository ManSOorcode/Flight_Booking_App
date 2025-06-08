import React from "react";
import { type FlightData } from "../../types/flightTypes";

interface Props {
  flights: FlightData[];
  onEdit: (flight: FlightData) => void;
  onDelete: (id: string) => void;
}

const FlightTable: React.FC<Props> = ({ flights, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">From</th>
            <th className="px-4 py-2">To</th>
            <th className="px-4 py-2">Departure</th>
            <th className="px-4 py-2">Arrival</th>
            <th className="px-4 py-2">Airline</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Seats (Booked/Available)</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights?.map((f) => (
            <tr key={f.id} className="text-center border-t">
              <td className="px-4 py-2">{f.from}</td>
              <td className="px-4 py-2">{f.to}</td>
              <td className="px-4 py-2">
                {new Date(f.departure).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                {new Date(f.arrival).toLocaleString()}
              </td>
              <td className="px-4 py-2">{f.airline}</td>
              <td className="px-4 py-2">₹{f.price}</td>
              <td className="px-4 py-2">
                {f.seatsBooked} / {f.seatsAvailable}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onEdit(f)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(f.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightTable;
