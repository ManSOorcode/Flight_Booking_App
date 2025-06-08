import { NavLink } from "react-router";

const AdminSidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/flights", label: "Manage Flights" },
    { to: "/admin/bookings", label: "View Bookings" },
  ];

  return (
    <aside
      className={`
        z-50 fixed md:static top-0 left-0 h-full w-64 bg-white shadow transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="p-5 flex justify-between items-center border-b md:hidden">
        <h2 className="text-xl font-bold text-cyan-600">Menu</h2>
        <button onClick={onClose}>
          {/* <X size={24} className="text-gray-700" /> */}X
        </button>
      </div>

      <div className="p-5">
        <h2 className="text-2xl font-bold mb-8 text-cyan-600 hidden md:block">
          Admin Panel
        </h2>
        <ul className="space-y-4">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-600 font-semibold"
                    : "text-gray-700 hover:text-cyan-500"
                }
                onClick={onClose}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default AdminSidebar;
