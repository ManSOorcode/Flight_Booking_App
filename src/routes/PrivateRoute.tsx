import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { assignRouteBaseOnRole, baseRoute } from "./assignRoutes";
import { toast } from "react-toastify";

type AllowedRole = "user" | "admin";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    try {
      const checkUser =
        JSON.parse(localStorage?.getItem("currentUser") || "{}") || [];
      if (!checkUser || !checkUser.role) {
        navigate("/auth");
        return;
      }

      const role: AllowedRole = checkUser.role;

      const allowRoutes = assignRouteBaseOnRole[role] || [];

      const validRoute = allowRoutes.some((allowRoute) => {
        return currentPath.startsWith(allowRoute);
      });

      if (!validRoute) {
        navigate(baseRoute[role]);
        throw new Error("Invalid route");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("You are not Allowed to this route");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return <Outlet />;
};

export default PrivateRoute;
