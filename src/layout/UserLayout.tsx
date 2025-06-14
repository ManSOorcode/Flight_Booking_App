import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

import {
  LogOutIcon,
  MenuIcon,
  PlaneIcon,
  UserIcon,
  XIcon,
} from "../assets/icons/Icons";

const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/user", label: "Home", icon: null },
    { path: "/user/my-bookings", label: "My Bookings", icon: null },
    {
      path: "#",
      label: "Favorites",
    },
  ];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const events = ["mousemove", "keydown", "click", "scroll"];

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        localStorage.removeItem("currentUser");

        navigate("/auth");
      }, 5 * 60 * 1000);
    };

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50  ">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-white shadow-md"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/user"
              className="flex items-center  group transition-transform hover:scale-105"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <PlaneIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r pl-2 from-orange-500 to-red-500 bg-clip-text text-transparent">
                FLYMATE
              </span>
            </Link>

            <nav className="hidden md:flex text-sm lg:text-md px-4 gap-4 lg:gap-8  items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4  py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActiveRoute(link.path)
                      ? "bg-orange-100 text-orange-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-orange-500"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden  md:flex items-center space-x-3">
              <div className="mr-4 hidden md:flex">
                {currentUser?.name && (
                  <div className="text-sm text-gray-600 mr-2">
                    Welcome,{" "}
                    <span className="font-semibold text-gray-800">
                      {currentUser.name}
                    </span>
                  </div>
                )}
              </div>

              <Link
                to="/user/profile"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActiveRoute("/profile")
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg"
                }`}
              >
                <UserIcon />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <LogOutIcon />
                <span>Logout</span>
              </button>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XIcon className="text-orange-500" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top-1 duration-200">
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActiveRoute(link.path)
                        ? "bg-orange-100 text-orange-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.icon}
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  {currentUser?.name && (
                    <div className="px-4 py-2 text-sm text-gray-600">
                      Welcome,{" "}
                      <span className="font-semibold text-gray-800">
                        {currentUser.name}
                      </span>
                    </div>
                  )}

                  <Link
                    to="/user/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <UserIcon />
                    <span className="font-medium">Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOutIcon />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-16 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 lg:px-16 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <PlaneIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                FLYMATE
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 Flymate. All rights reserved. Your journey begins here.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
