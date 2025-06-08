interface AssignRoutes {
  admin: string[];
  user: string[];
}

export const assignRouteBaseOnRole: AssignRoutes = {
  user: ["/ticket"],

  admin: ["/users", "ticket", "/booking", "/admin/flights", "/admin"],
};

export const baseRoute = {
  admin: "/admin",
  user: "/user",
};
