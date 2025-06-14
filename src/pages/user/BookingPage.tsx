import React, { useState } from "react";
import { useFlightContext } from "../../context/useFlightContext";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CreditCardIcon,
  MapPinIcon,
  PlaneIcon,
  UsersIcon,
} from "../../assets/icons/Icons";

const formatTime = (time: string) => {
  const d = new Date(time);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDate = (time: string) => {
  const d = new Date(time);
  const weekday = d.toLocaleDateString("en-IN", { weekday: "short" });
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleDateString("en-IN", { month: "short" });
  const year = d.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
};

const BookingPage: React.FC = () => {
  const { selectedFlight } = useFlightContext();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const {
    resetForm,
    values,
    handleBlur,
    handleChange,
    errors,
    handleSubmit,
    touched,
  } = useFormik({
    initialValues: {
      fullName: "",
      age: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      age: Yup.number()
        .typeError("Age must be a number")
        .required("Age is required")
        .min(1, "Age must be at least 1"),
    }),
    onSubmit: () => {
      setShowPaymentModal(true);
    },
  });

  if (!selectedFlight) {
    return (
      <div className="text-center py-10 text-gray-600">
        No flight selected. Please go back and choose a flight.
      </div>
    );
  }

  const handlePaymentSuccess = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const booking = {
      id: uuidv4(),
      userEmail: currentUser.email,
      flightId: selectedFlight?.id,
      from: selectedFlight?.from,
      to: selectedFlight?.to,
      airline: selectedFlight?.airline,
      departure: selectedFlight?.departure,
      arrival: selectedFlight?.arrival,
      passengers: [
        {
          name: values.fullName,
          age: Number(values.age),
        },
      ],
      status: "confirm",
      totalAmount: selectedFlight?.price,
      bookingDate: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
    existing.push(booking);
    localStorage.setItem("bookings", JSON.stringify(existing));

    resetForm();
    setShowPaymentModal(false);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate("/user/my-bookings");
    }, 3000);
  };

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <CreditCardIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-600 mb-6">
                Processing your payment securely...
              </p>

              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-150"></div>
              </div>

              <button
                className="w-full bg-gradient-to-r cursor-pointer from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                onClick={handlePaymentSuccess}
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <CheckIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-gray-600">Redirecting to your bookings...</p>
          </div>
        </div>
      )}

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Review Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Journey
              </span>
            </h1>
            <p className="text-gray-600">
              Confirm your flight details and passenger information
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8 mb-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
                  <span>{selectedFlight.from}</span>
                  <ArrowRightIcon className="w-6 h-6 text-blue-500" />
                  <span>{selectedFlight.to}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(selectedFlight.departure)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center  lg:justify-start space-x-3 mb-2">
                  <div className="w-12 h-12 rounded-full flex justify-center items-center   shadow-md">
                    <img
                      src={selectedFlight.airline_logo}
                      alt="airline"
                      className="  p-2  object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatTime(selectedFlight.departure)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedFlight.from}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {selectedFlight.departure_airport.name}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <PlaneIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFlight.airline}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {Math.floor(selectedFlight.duration / 60)}h{" "}
                    {selectedFlight.duration % 60}m
                  </span>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mb-2"></div>
                <p className="text-xs text-gray-500">
                  {selectedFlight.flight_number}
                </p>
              </div>

              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-end space-x-3 mb-2">
                  <div className="lg:order-2">
                    <p className="text-2xl font-bold text-gray-800">
                      {formatTime(selectedFlight.arrival)}
                    </p>
                    <p className="text-sm text-gray-600">{selectedFlight.to}</p>
                  </div>
                  <MapPinIcon className="w-6 h-6 text-red-500 lg:order-1" />
                </div>
                <p className="text-xs text-gray-500">
                  {selectedFlight.arrival_airport.name}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {selectedFlight.travel_class}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {selectedFlight.legroom}
                </span>
                {selectedFlight.extensions?.map((ext, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <form
              className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center space-x-3 mb-6">
                <UsersIcon className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold text-gray-800">
                  Passenger Details
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter your age"
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    value={values.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.age && errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>

            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCardIcon className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold text-gray-800">
                  Fare Summary
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="font-medium">
                    ₹{(selectedFlight.price * 0.9).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">
                    ₹{(selectedFlight.price * 0.1).toFixed(0)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                      ₹{selectedFlight.price}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-1">
                  ✈️ Free Cancellation
                </p>
                <p className="text-xs text-blue-600">
                  Cancel within 24 hours for a full refund
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
