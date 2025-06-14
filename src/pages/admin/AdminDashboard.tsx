import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  BookingsIcon,
  CalendarIcon,
  ClockIcon,
  PlaneIcon,
  RevenueIcon,
  TrendingUpIcon,
  UsersIcon,
} from "../../assets/icons/Icons";
import type { FlightData } from "../../types/flightTypes";
import type { Booking } from "../../types/bookingTypes";
import type { UserType } from "../../types/UserTypes";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  bgColor,
  trend,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        {trend && (
          <div className="flex items-center space-x-1">
            <TrendingUpIcon />
            <span className="text-sm text-green-600 font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className={`${bgColor} ${color} p-3 rounded-xl`}>{icon}</div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem("flights") || "[]");
    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setFlights(storedFlights);
    setBookings(storedBookings);
    setUsers(storedUsers);
  }, []);

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );
  const recentBookings = bookings.slice(-5).reverse();

  const statsData = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: <BookingsIcon />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12%",
    },
    {
      title: "Active Flights",
      value: flights.length,
      icon: <PlaneIcon />,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      trend: "+8%",
    },
    {
      title: "Total Users",
      value: users.length,
      icon: <UsersIcon />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+24%",
    },
    {
      title: "Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <RevenueIcon />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "+18%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor your flight operations and performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CalendarIcon size={16} />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1  gap-6">
        <div className=" bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Bookings
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {recentBookings.length} recent
              </span>
            </div>
          </div>
          <div className="p-6">
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookingsIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {booking.passengers?.[0]?.name || "Unknown Passenger"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Flight {booking.flightId} • {booking.from} →{" "}
                        {booking.to}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        ₹{booking.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <ClockIcon size={16} />
                        <span className="ml-1">Just now</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookingsIcon />
                </div>
                <p className="text-gray-500">No recent bookings</p>
              </div>
            )}
          </div>
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Upcoming Flights
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {upcomingFlights.length} scheduled
              </span>
            </div>
          </div>
          <div className="p-6">
            {upcomingFlights.length > 0 ? (
              <div className="space-y-4">
                {upcomingFlights.map((flight, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-cyan-400 pl-4 py-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {flight.airline}
                      </p>
                      <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                        {flight.flightNumber || flight.id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {flight.from} → {flight.to}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon />
                      <span className="ml-1">
                        {new Date(flight.departure).toLocaleDateString()}
                      </span>
                      <ClockIcon />
                      <span className="ml-1">
                        {new Date(flight.departure).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlaneIcon />
                </div>
                <p className="text-gray-500">No upcoming flights</p>
              </div>
            )}
          </div>
        </div> */}
      </div>

      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
            <p className="text-cyan-100">
              Manage your flight operations efficiently
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={"/admin/flights"}
              className="bg-white/20 hover:bg-white/30 cursor-pointer text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Add Flight
            </Link>
            <button className="bg-white text-cyan-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
