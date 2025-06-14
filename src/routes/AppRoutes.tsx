import { createBrowserRouter, RouterProvider } from "react-router";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import UserLayout from "../layout/UserLayout";
import AdminLayout from "../layout/AdminLayout";
import PrivateRoute from "./PrivateRoute";
import ManageFlights from "../pages/admin/ManageFlights";
import BookingList from "../pages/admin/BookingList";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserHomePage from "../pages/user/UserHomePage";
import UserBookings from "../pages/user/UserBookings";
import BookingPage from "../pages/user/BookingPage";
import UserProfile from "../pages/user/UserProfile";

import AuthLayout from "../pages/auth/AuthLayout";

const routes = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },

  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/user",
        element: <UserLayout />,
        children: [
          {
            path: "",
            element: <UserHomePage />,
          },
          {
            path: "my-bookings",
            element: <UserBookings />,
          },
          {
            path: "booking",
            element: <BookingPage />,
          },

          { path: "profile", element: <UserProfile /> },
        ],
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "flights", element: <ManageFlights /> },
          { path: "bookings", element: <BookingList /> },
        ],
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={routes} />;
};

export default AppRoutes;
