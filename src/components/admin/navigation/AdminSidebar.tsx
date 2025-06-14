import { NavLink } from "react-router";
import {
  BookingsIcon,
  DashboardIcon,
  PlaneIcon,
  XIcon,
} from "../../../assets/icons/Icons";

const AdminSidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/admin/flights", label: "Manage Flights", icon: <PlaneIcon /> },
    { to: "/admin/bookings", label: "View Bookings", icon: <BookingsIcon /> },
  ];

  return (
    <aside
      className={`
        z-50 fixed md:static top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="p-6 flex justify-between items-center border-b border-gray-200 md:hidden">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <DashboardIcon className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <XIcon />
        </button>
      </div>

      <div className="hidden md:block p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl flex items-center justify-center">
            <PlaneIcon />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Flight Admin</h2>
            <p className="text-xs text-gray-600">Management Panel</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {links.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-cyan-50 text-cyan-600 border-r-2 border-cyan-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-cyan-600"
                  }`
                }
                onClick={onClose}
              >
                <span className="transition-colors duration-200">{icon}</span>
                <span className="font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500">Flight Management System</p>
          <p className="text-xs text-gray-400 mt-1">v2.1.0</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
