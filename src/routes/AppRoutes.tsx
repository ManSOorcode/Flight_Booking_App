import { createBrowserRouter, RouterProvider } from "react-router";
import ParentAuth from "../pages/auth/ParentAuth";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
// import Layout from "../layout/Layout";
import Ticket from "../pages/Ticket";
import UserLayout from "../layout/UserLayout";
import AdminLayout from "../layout/AdminLayout";
import PrivateRoute from "./PrivateRoute";
import ManageFlights from "../pages/admin/ManageFlights";

const routes = createBrowserRouter([
  // part one: auth
  {
    path: "/auth",
    element: <ParentAuth />,
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

  //  Part two: UI part
  {
    // user
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/user",
        element: <UserLayout />,
        children: [
          {
            path: "ticket",
            element: <Ticket />,
          },
        ],
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          // admin

          // { path: "dashboard", element: <AdminDashboard /> },
          { path: "flights", element: <ManageFlights /> },

          // { path: "bookings", element: <AllBookings /> },
        ],
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={routes} />;
};

export default AppRoutes;
