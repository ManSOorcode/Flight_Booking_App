import { useNavigate } from "react-router";
import {
  ClockIcon,
  LogOutIcon,
  MailIcon,
  MapPinIcon,
  PlaneIcon,
  ShieldIcon,
  UserIcon,
} from "../../assets/icons/Icons";
import { useEffect, useState } from "react";
import type { UserType } from "../../types/UserTypes";

const UserProfile = () => {
  const [currentUserDetails, setCurrentUser] = useState<UserType | null>(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  const fetchUserProfile = async () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    setCurrentUser(currentUser);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const user = {
    name: currentUserDetails?.name,
    email: currentUserDetails?.email,
    role: "premium",
    joinDate: "2025",
    totalFlights: 24,
    milesEarned: "125,430",
  };

  return (
    <div className="min-h-screen   p-4">
      <div className="w-full  mx-auto grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-8 ">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-1">
              {user.name || "Unnamed User"}
            </h1>
            <p className="text-gray-600 text-sm mb-2">{user.email}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-semibold capitalize">
              <ShieldIcon className="w-3 h-3 mr-1" />
              {user.role} Member
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
              <PlaneIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-700">
                {user.totalFlights}
              </div>
              <div className="text-xs text-blue-600 font-medium">
                Total Flights
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
              <MapPinIcon className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-700">
                {user.milesEarned}
              </div>
              <div className="text-xs text-purple-600 font-medium">
                Miles Earned
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-gray-600" />
              Profile Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <UserIcon className="w-4 h-4 text-gray-500 mr-3" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Full Name
                  </div>
                  <div className="text-gray-800 font-medium">{user.name}</div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <MailIcon className="w-4 h-4 text-gray-500 mr-3" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Email Address
                  </div>
                  <div className="text-gray-800 font-medium">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <ClockIcon className="w-4 h-4 text-gray-500 mr-3" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Member Since
                  </div>
                  <div className="text-gray-800 font-medium">
                    {user.joinDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1">
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
            >
              <LogOutIcon className="w-5 h-5 mr-2" />
              Sign Out
            </button>

            <div className="text-center mt-8 text-xs text-gray-400">
              Flymate Flight App v2.1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
