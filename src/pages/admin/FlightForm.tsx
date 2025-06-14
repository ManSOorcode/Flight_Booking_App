import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CityAutoComplete from "../../components/usercomponents/CityAutoComplete";

interface Props {
  onSubmit: (flight: FlightData) => void;
  initialData?: Partial<FlightData>;
  setEditingFlight?: (flight: FlightData | null) => void;
  isUpdate?: boolean;
}

const AIRLINE_MAP: Record<string, { logo: string; airplane: string }> = {
  Emirates: {
    logo: "https://www.gstatic.com/flights/airline_logos/70px/EK.png",
    airplane: "Boeing 777",
  },
  "British Airways": {
    logo: "https://www.gstatic.com/flights/airline_logos/70px/BA.png",
    airplane: "Boeing 787",
  },
  "Singapore Airlines": {
    logo: "https://www.gstatic.com/flights/airline_logos/70px/SQ.png",
    airplane: "Airbus A380",
  },
  Lufthansa: {
    logo: "https://www.gstatic.com/flights/airline_logos/70px/LH.png",
    airplane: "Airbus A350",
  },
};

import {
  AwardIcon,
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  HashIcon,
  MapPinIcon,
  PlaneIcon,
  PlusIcon,
  RulerIcon,
  SettingsIcon,
  UsersIcon,
  WifiIcon,
  XIcon,
} from "../../assets/icons/Icons";
import { toast } from "react-toastify";

interface FlightData {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  airline: string;
  price: number;
  seatsAvailable: number;
  seatsBooked: number;
  departure_airport: {
    name: string;
    id: string;
    time: string;
  };
  arrival_airport: {
    name: string;
    id: string;
    time: string;
  };
  duration: number;
  airplane: string;
  airline_logo: string;
  flight_number: string;
  travel_class: string;
  legroom: string;
  extensions: string[];
}

interface Props {
  onSubmit: (flight: FlightData) => void;
  initialData?: Partial<FlightData>;
  setEditingFlight?: (flight: FlightData | null) => void;
  isUpdate?: boolean;
}

interface AirportsTypes {
  city: string;
  iata: string;
  country: string;
  airport: string;
}

const FlightForm: React.FC<Props> = ({
  onSubmit,
  initialData,
  setEditingFlight,
  isUpdate,
}) => {
  const calculateDuration = (departure: string, arrival: string): number => {
    if (!departure || !arrival) return 0;
    const dep = new Date(departure);
    const arr = new Date(arrival);
    return Math.floor((arr.getTime() - dep.getTime()) / (1000 * 60));
  };

  const generateFlightNumber = (airline: string): string => {
    const airlineCode =
      airline === "Emirates"
        ? "EM"
        : airline === "British Airways"
        ? "BA"
        : airline === "Singapore Airlines"
        ? "SQ"
        : airline === "Lufthansa"
        ? "LH"
        : "XX";
    const flightNum = Math.floor(Math.random() * 900) + 100;
    return `${airlineCode}${flightNum}`;
  };

  const [airports, setAirports] = useState<[]>([]);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch("/airports-min.json");
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Error loading airport data");
        }
      }
    };

    fetchAirports();
  }, []);

  const enrichAirport = (iata: string) => {
    const airport = airports?.find((a: AirportsTypes) => a.iata === iata) || {
      city: "",
      iata,
      displayText: iata,
    };
    if (!airport) return { city: "", iata, displayText: iata };

    return {
      city: airport?.city,
      iata: airport?.iata,
      displayText: `${airport?.city} (${airport?.iata})`,
    };
  };

  const initialFrom = initialData?.from
    ? enrichAirport(initialData.from)
    : { city: "", iata: "", displayText: "" };

  const initialTo = initialData?.to
    ? enrichAirport(initialData.to)
    : { city: "", iata: "", displayText: "" };

  const formik = useFormik({
    initialValues: {
      id: initialData?.id || "",
      from: initialFrom,
      to: initialTo,
      departure: initialData?.departure || "",
      arrival: initialData?.arrival || "",
      airline: initialData?.airline || "",
      price: initialData?.price || 0,
      seatsAvailable: initialData?.seatsAvailable || 0,
      seatsBooked: initialData?.seatsBooked || 0,
      airplane: initialData?.airplane || "",
      flight_number: initialData?.flight_number || "",
      travel_class: initialData?.travel_class || "Economy",
      legroom: initialData?.legroom || "31 in",
      extensions:
        initialData?.extensions?.join(", ") || "Wi-Fi available, In-seat power",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      from: Yup.object().shape({
        city: Yup.string().required("City is required"),
        iata: Yup.string().required("IATA code is required"),
        displayText: Yup.string().required("Departure airport is required"),
      }),
      to: Yup.object().shape({
        city: Yup.string().required("City is required"),
        iata: Yup.string().required("IATA code is required"),
        displayText: Yup.string().required("Departure airport is required"),
      }),
      departure: Yup.string().required("Departure time is required"),
      arrival: Yup.string().required("Arrival time is required"),
      airline: Yup.string().required("Airline is required"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be positive"),
      seatsAvailable: Yup.number()
        .min(0, "Seats available must be positive")
        .required("Required"),
      seatsBooked: Yup.number()
        .min(0, "Seats booked must be positive")
        .required("Required"),
      airplane: Yup.string().required("Aircraft type is required"),
      flight_number: Yup.string().required("Flight number is required"),
      travel_class: Yup.string().required("Travel class is required"),
      legroom: Yup.string().required("Legroom information is required"),
      extensions: Yup.string().required("Flight amenities are required"),
    }),
    onSubmit: (values) => {
      try {
        const airlineInfo = AIRLINE_MAP[values.airline] || {
          logo: "https://www.gstatic.com/flights/airline_logos/70px/XX.png",
          airplane: values.airplane || "Boeing 737",
        };

        const flight: FlightData = {
          id: isUpdate
            ? values.id
            : `${values.from.iata}-${values.to.iata}-${Date.now()}`,
          from: values.from.iata,
          to: values.to.iata,
          departure: values.departure,
          arrival: values.arrival,
          airline: values.airline,
          price: values.price,
          seatsAvailable: values.seatsAvailable,
          seatsBooked: values.seatsBooked,
          departure_airport: {
            name: values.from.displayText,
            id: values.from.iata,
            time: values.departure,
          },
          arrival_airport: {
            name: values.to.displayText,
            id: values.to.iata,
            time: values.arrival,
          },
          duration: calculateDuration(values.departure, values.arrival),
          airplane: values.airplane || airlineInfo.airplane,
          airline_logo: airlineInfo.logo,
          flight_number:
            values.flight_number || generateFlightNumber(values.airline),
          travel_class: values.travel_class,
          legroom: values.legroom,
          extensions: values.extensions
            .split(",")
            .map((ext) => ext.trim())
            .filter((ext) => ext.length > 0),
        };

        onSubmit(flight);

        toast.success(
          isUpdate
            ? "Flight updated successfully!"
            : "Flight created successfully!"
        );

        if (!isUpdate) {
          formik.resetForm();
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong while saving the flight.");
        }
      }
    },
  });

  const getFieldError = (fieldName: keyof typeof formik.touched) => {
    return formik.touched[fieldName] && formik.errors[fieldName];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4 md:mb-6">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <PlaneIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isUpdate ? "Edit Flight" : "Add New Flight"}
              </h2>
              <p className="text-sm text-gray-600">
                {isUpdate
                  ? "Update flight information"
                  : "Create a new flight booking"}
              </p>
            </div>
          </div>
          {isUpdate && setEditingFlight && (
            <button
              type="button"
              onClick={() => setEditingFlight(null)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <form className="p-6 space-y-8" onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPinIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Route Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <CityAutoComplete
                name="from"
                value={formik.values.from.displayText}
                onChange={formik.handleChange}
                inputStyle={
                  "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 font-medium"
                }
                label="From Airport"
                labelStyle={
                  "flex items-center gap-2 text-sm font-medium text-gray-700"
                }
                icon={MapPinIcon}
              />
              {getFieldError("from") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.from?.displayText}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <CityAutoComplete
                name="to"
                value={formik.values.to.displayText}
                onChange={formik.handleChange}
                inputStyle={
                  "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-gray-800 font-medium"
                }
                label="To Airport"
                labelStyle={
                  "flex items-center gap-2 text-sm font-medium text-gray-700"
                }
                icon={MapPinIcon}
              />
              {getFieldError("to") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.to?.displayText}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="departure"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <CalendarIcon className="w-4 h-4" />
                Departure Date & Time
              </label>
              <input
                id="departure"
                name="departure"
                type="datetime-local"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.departure}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {getFieldError("departure") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.departure}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="arrival"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <CalendarIcon className="w-4 h-4" />
                Arrival Date & Time
              </label>
              <input
                id="arrival"
                name="arrival"
                type="datetime-local"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.arrival}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {getFieldError("arrival") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.arrival}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <PlaneIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Aircraft Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="airline"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <AwardIcon className="w-4 h-4" />
                Airline
              </label>
              <select
                id="airline"
                name="airline"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.airline}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select airline</option>
                {Object.keys(AIRLINE_MAP).map((airline) => (
                  <option key={airline} value={airline}>
                    {airline}
                  </option>
                ))}
              </select>
              {getFieldError("airline") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.airline}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="airplane"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <SettingsIcon className="w-4 h-4" />
                Aircraft Type
              </label>
              <input
                id="airplane"
                name="airplane"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.airplane}
                placeholder="e.g., Boeing 777"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {getFieldError("airplane") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.airplane}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <HashIcon className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Flight Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="flight_number"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <HashIcon className="w-4 h-4" />
                Flight Number
              </label>
              <input
                id="flight_number"
                name="flight_number"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.flight_number}
                placeholder="e.g., EM704"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {getFieldError("flight_number") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.flight_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="travel_class"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <AwardIcon className="w-4 h-4" />
                Travel Class
              </label>
              <select
                id="travel_class"
                name="travel_class"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.travel_class}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First">First</option>
              </select>
              {getFieldError("travel_class") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.travel_class}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="legroom"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <RulerIcon className="w-4 h-4" />
                Legroom
              </label>
              <input
                id="legroom"
                name="legroom"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.legroom}
                placeholder="e.g., 31 in"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {getFieldError("legroom") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.legroom}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSignIcon className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Pricing & Capacity
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <DollarSignIcon className="w-4 h-4" />
                Price (₹)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {getFieldError("price") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.price}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="seatsAvailable"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <UsersIcon className="w-4 h-4" />
                Seats Available
              </label>
              <input
                id="seatsAvailable"
                name="seatsAvailable"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.seatsAvailable}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {getFieldError("seatsAvailable") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.seatsAvailable}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="seatsBooked"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <UsersIcon className="w-4 h-4" />
                Seats Booked
              </label>
              <input
                id="seatsBooked"
                name="seatsBooked"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.seatsBooked}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {getFieldError("seatsBooked") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <XIcon className="w-4 h-4" />
                  {formik.errors.seatsBooked}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <WifiIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Flight Amenities
            </h3>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="extensions"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <WifiIcon className="w-4 h-4" />
              Amenities (comma-separated)
            </label>
            <textarea
              id="extensions"
              name="extensions"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.extensions}
              placeholder="e.g., Wi-Fi available, In-seat power, Carbon emissions: 643kg"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
            {getFieldError("extensions") && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <XIcon className="w-4 h-4" />
                {formik.errors.extensions}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isUpdate ? (
              <SettingsIcon className="w-4 h-4" />
            ) : (
              <PlusIcon className="w-4 h-4" />
            )}
            {isUpdate ? "Update Flight" : "Create Flight"}
          </button>

          {isUpdate && setEditingFlight && (
            <button
              type="button"
              onClick={() => setEditingFlight(null)}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <XIcon className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FlightForm;
