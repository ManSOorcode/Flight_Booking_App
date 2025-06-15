import React from "react";
import { type FlightData } from "../../types/flightTypes";
import {
  ClockIcon,
  MapPinIcon,
  PencilIcon,
  PlaneIcon,
  TrashIcon,
  UsersIcon,
} from "../../assets/icons/Icons";

interface Props {
  flights: FlightData[];
  onEdit: (flight: FlightData) => void;
  onDelete: (id: string) => void;
}

const FlightTable: React.FC<Props> = ({ flights, onEdit, onDelete }) => {
  const getOccupancyColor = (booked: number, available: number) => {
    const percentage = (booked / available) * 100;
    if (percentage >= 90) return "bg-red-100 text-red-800";
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
  };

  return (
    //  max-w-screen
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-screen">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <PlaneIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Flight Management
          </h3>
          <span className="ml-auto bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {flights?.length || 0} Flights
          </span>
        </div>
      </div>

      <div className=" overflow-x-auto w-full">
        <table className=" min-w-[1000px] w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Airline
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Occupancy
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flights?.reverse().map((flight) => {
              const departure = formatDateTime(flight.departure);
              const arrival = formatDateTime(flight.arrival);
              const occupancyPercentage = Math.round(
                (flight.seatsBooked / flight.seatsAvailable) * 100
              );

              return (
                <tr
                  key={flight.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {flight.from}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-8 border-t border-gray-300"></div>
                        <PlaneIcon className="w-4 h-4 text-blue-500 transform rotate-90" />
                        <div className="w-8 border-t border-gray-300"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {flight.to}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {departure.time}
                        </span>
                        <span className="text-xs text-gray-500">
                          {departure.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {arrival.time}
                        </span>
                        <span className="text-xs text-gray-500">
                          {arrival.date}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-800">
                          {flight.airline.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {flight.airline}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{flight.price.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {flight.seatsBooked} / {flight.seatsAvailable}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            occupancyPercentage >= 90
                              ? "bg-red-500"
                              : occupancyPercentage >= 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${occupancyPercentage}%` }}
                        ></div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOccupancyColor(
                          flight.seatsBooked,
                          flight.seatsAvailable
                        )}`}
                      >
                        {occupancyPercentage}% Full
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(flight)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(flight.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(!flights || flights.length === 0) && (
        <div className="text-center py-12">
          <PlaneIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No flights found
          </h3>
          <p className="text-gray-500">
            Get started by adding your first flight.
          </p>
        </div>
      )}
    </div>
  );
};

export default FlightTable;
