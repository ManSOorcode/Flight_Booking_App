import { useEffect, useState } from "react";
import {
  PlaneIcon,
  CalendarIcon,
  UsersIcon,
  CreditCardIcon,
  XIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
} from "../../assets/icons/Icons";
import type { Booking } from "../../types/bookingTypes";

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchUserBookings = () => {
    const all = JSON.parse(localStorage.getItem("bookings") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userBookings = all.filter(
      (b: Booking) => b.userEmail === currentUser.email
    );
    setBookings(userBookings);
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const cancelBooking = async (id: string): Promise<void> => {
    setCancellingId(id);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedBookings = bookings.filter((b) => b.id !== id);
    setBookings(updatedBookings);
    setCancellingId(null);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getFlightDuration = (departure: string, arrival: string): string => {
    const dep: Date = new Date(departure);
    const arr: Date = new Date(arrival);
    const diffMs = arr.getTime() - dep.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getAirlineColor = (airline: string): string => {
    const colors: { [key: string]: string } = {
      Emirates: "from-red-500 to-red-600",
      "British Airways": "from-blue-600 to-blue-700",
      "Air India": "from-orange-500 to-orange-600",
      Lufthansa: "from-yellow-500 to-yellow-600",
      "Singapore Airlines": "from-blue-500 to-blue-600",
    };
    return colors[airline] || "from-gray-500 to-gray-600";
  };

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <PlaneIcon className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No Bookings Yet
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              You haven't booked any flights yet. Start exploring destinations!
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Book Your First Flight
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your flight reservations</p>
        </div>

        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`bg-gradient-to-r ${getAirlineColor(
                  booking.airline
                )} p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <PlaneIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {booking.airline}
                      </h3>
                      <p className="text-white/80 text-sm">
                        Flight {booking.flightId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Booking ID</p>
                    <p className="text-white font-mono text-sm">
                      {booking.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-2xl font-bold text-gray-800">
                          {booking.from}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(booking.departure)}
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatTime(booking.departure)}
                      </p>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300"></div>
                        <PlaneIcon className="w-5 h-5 text-blue-500 transform rotate-90" />
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-300 to-blue-500"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl font-bold text-gray-800">
                          {booking.to}
                        </span>
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(booking.arrival)}
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatTime(booking.arrival)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                    <ClockIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-600 font-medium">
                      Duration:{" "}
                      {getFlightDuration(booking.departure, booking.arrival)}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <UsersIcon className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-800">
                        Passengers
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {booking.passengers.map((passenger, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <UserIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">
                            {passenger.name} ({passenger.age}y)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <CalendarIcon className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-800">Booked On</h4>
                    </div>
                    <p className="text-gray-700">
                      {formatDate(booking.bookingDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTime(booking.bookingDate)}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <CreditCardIcon className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-gray-800">
                        Total Paid
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg font-semibold transition-colors"
                  >
                    {cancellingId === booking.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Cancelling...</span>
                      </>
                    ) : (
                      <>
                        <XIcon className="w-4 h-4" />
                        <span>Cancel Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
