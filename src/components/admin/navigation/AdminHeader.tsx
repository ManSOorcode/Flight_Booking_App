import { useNavigate } from "react-router";
import {
  BellIcon,
  LogOutIcon,
  MenuIcon,
  // SearchIcon,
} from "../../../assets/icons/Icons";

const AdminHeader = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  return (
    <header className="bg-white  shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Welcome, {user?.name.split(" ")[0] || "Admin"}!
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your flight operations
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* <div className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors w-64 text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <SearchIcon />
              </div>
            </div>
          </div> */}

          <button className="hidden md:block relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <BellIcon />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">3</span>
            </span>
          </button>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="flex w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full  items-center justify-center">
              <span className="text-sm font-medium text-white">
                {(user?.name || "A").charAt(0).toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
            >
              <LogOutIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden md:flex">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
