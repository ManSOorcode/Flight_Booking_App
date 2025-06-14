import React, { useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import CityAutoComplete from "../../components/usercomponents/CityAutoComplete";

import { useFlightContext } from "../../context/useFlightContext";
import {
  ArrowRightLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PlaneIcon,
  SearchIcon,
  UsersIcon,
} from "../../assets/icons/Icons";
import type { FlightData } from "../../types/flightTypes";
import { toast } from "react-toastify";

interface FlightFilter {
  from: { city: string; iata: string; displayText: string };
  to: { city: string; iata: string; displayText: string };
  departure: string;
  return: string;
  passengers: string;
  direct: boolean;
}

const UserHomePage: React.FC = () => {
  const [filteredFlights, setFilteredFlights] = useState<FlightData[]>([]);

  const formik = useFormik({
    initialValues: {
      from: { city: "", iata: "", displayText: "" },
      to: { city: "", iata: "", displayText: "" },
      departure: "",
      return: "",
      passengers: "1 Adult, Economy",
      direct: false,
    },
    validationSchema: Yup.object({
      from: Yup.object().shape({
        city: Yup.string().required("City is required"),
        iata: Yup.string().required("IATA code is required"),
      }),
      to: Yup.object().shape({
        city: Yup.string().required("City is required"),
        iata: Yup.string().required("IATA code is required"),
      }),
      departure: Yup.date().required("Required"),
    }),
    onSubmit: (values) => {
      console.log("From City:", values.from.city);
      console.log("From IATA:", values.from.iata);
      console.log("To City:", values.to.city);
      console.log("To IATA:", values.to.iata);
      getSearchFlight(values);
    },
  });

  console.log(formik.values);

  const { setSelectedFlight } = useFlightContext();
  const navigate = useNavigate();

  const handleBook = (flight: FlightData) => {
    setSelectedFlight(flight);
    navigate(`/user/booking`);
  };

  const getSearchFlight = async (searchParams: FlightFilter) => {
    try {
      const airportRes = await fetch("/airports-min.json");
      const airports = await airportRes.json();

      const cityToIATA: Record<string, string> = {};
      airports.forEach(
        (a: {
          city: string;
          iata: string;
          airport: string;
          country: string;
        }) => {
          if (a.city) cityToIATA[a.city.toLowerCase()] = a.iata;
        }
      );

      const fromIATA = formik.values.from.iata;

      const toIATA = formik.values.to.iata;

      if (!fromIATA || !toIATA) {
        console.warn();
        setFilteredFlights([]);
        throw new Error("Invalid city input. No matching IATA code.");
      }

      const storedFlights = localStorage.getItem("flights");
      let allFlights = [];

      if (storedFlights) {
        allFlights = JSON.parse(storedFlights);
      } else {
        const response = await fetch("/mock_flights.json");
        allFlights = await response.json();
        localStorage.setItem("flights", JSON.stringify(allFlights));
      }

      localStorage.setItem("searchParams", JSON.stringify(searchParams));

      const filtered = allFlights.filter((f: FlightData) => {
        const matchFrom = f.from.toLowerCase() === fromIATA.toLowerCase();
        const matchTo = f.to.toLowerCase() === toIATA.toLowerCase();
        const matchDirect =
          !searchParams.direct || f.seatsAvailable - f.seatsBooked > 0;

        return matchFrom && matchTo && matchDirect;
      });

      setFilteredFlights(filtered);
    } catch (error) {
      console.error("Failed to load or filter flights:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to load or filter flights");
      }
    }
  };

  const getAirlineColor = (airline: string) => {
    const colors: Record<string, string> = {
      "Air India": "from-orange-500 to-red-500",
      IndiGo: "from-blue-500 to-indigo-600",
      SpiceJet: "from-red-500 to-pink-500",
      Vistara: "from-purple-500 to-blue-500",
      GoAir: "from-green-500 to-teal-500",
    };
    return colors[airline] || "from-gray-500 to-gray-600";
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Perfect Flight
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl">
            Search and compare flights from hundreds of airlines to get the best
            deals for your journey.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CityAutoComplete
              name="from"
              label="From"
              value={formik.values.from.displayText}
              onChange={formik.handleChange}
              icon={MapPinIcon}
              inputStyle={
                "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 font-medium"
              }
              labelStyle={"block text-sm font-semibold text-gray-700 mb-2"}
            />

            <CityAutoComplete
              name="to"
              label="To"
              value={formik.values.to.displayText}
              onChange={formik.handleChange}
              icon={MapPinIcon}
              inputStyle={
                "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 font-medium"
              }
              labelStyle={"block text-sm font-semibold text-gray-700 mb-2"}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <CalendarIcon className="inline mr-2" />
                Departure
              </label>
              <input
                type="date"
                name="departure"
                onChange={formik.handleChange}
                value={formik.values.departure}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <CalendarIcon className="inline mr-2" />
                Return
              </label>
              <input
                type="date"
                name="return"
                onChange={formik.handleChange}
                value={formik.values.return}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <UsersIcon className="inline mr-2" />
                Travellers
              </label>
              <select
                name="passengers"
                onChange={formik.handleChange}
                value={formik.values.passengers}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 font-medium"
              >
                <option>1 Adult, Economy</option>
                <option>2 Adults, Economy</option>
                <option>1 Adult, Business</option>
                <option>2 Adults, Business</option>
                <option>3 Adults, Economy</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="direct"
                  onChange={formik.handleChange}
                  checked={formik.values.direct}
                  className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Direct flights only
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="flex items-center cursor-pointer justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <>
                <SearchIcon className="w-5 h-5" />
                <span>Search Flights</span>
              </>
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Flight Results</h2>
          {filteredFlights.length > 0 && (
            <p className="text-gray-600">
              {filteredFlights.length} flights found
            </p>
          )}
        </div>

        {filteredFlights.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <PlaneIcon className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl text-gray-600 mb-2">No flights found</p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
              >
                <div
                  className={`bg-gradient-to-r ${getAirlineColor(
                    flight.airline
                  )} p-4`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <PlaneIcon className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {flight.airline}
                        </h3>
                        <p className="text-white/80 text-sm">
                          Flight {flight.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-2xl font-bold">
                        ₹{flight.price.toLocaleString()}
                      </p>
                      <p className="text-white/80 text-sm">per person</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-800">
                        {flight.from}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        {formatDate(flight.departure)}
                      </p>
                      <p className="text-lg font-semibold text-gray-700">
                        {formatTime(flight.departure)}
                      </p>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-8">
                      <div className="flex items-center space-x-2 w-full">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 relative">
                          <ArrowRightLeftIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 bg-white p-1 rounded-full shadow-sm" />
                        </div>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-800">
                        {flight.to}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        {formatDate(flight.arrival)}
                      </p>
                      <p className="text-lg font-semibold text-gray-700">
                        {formatTime(flight.arrival)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ClockIcon />
                      <span className="text-sm font-medium">
                        {flight.duration}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => handleBook(flight)}
                      className="bg-gradient-to-r cursor-pointer from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHomePage;
