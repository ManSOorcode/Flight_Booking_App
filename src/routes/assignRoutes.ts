interface AssignRoutes {
  admin: string[];
  user: string[];
}

export const assignRouteBaseOnRole: AssignRoutes = {
  user: ["/user", "/my-bookings", "/payment", "/profile"],

  admin: ["/booking", "/flights", "/admin", "/dashboard"],
};

export const baseRoute = {
  admin: "/admin",
  user: "/user",
};
