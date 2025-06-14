import { Link, Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

import { ArrowLeftIcon, PlaneIcon } from "../../assets/icons/Icons";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
              <PlaneIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xl font-bold text-gray-800">FLYMATE</span>
          </div>

          <Link
            to="/"
            className="group flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeftIcon className="w-4 h-4 text-gray-700 group-hover:text-indigo-600 transition-colors" />
            <span className="text-gray-700 group-hover:text-indigo-600 font-medium transition-colors">
              Back to Home
            </span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
        toastClassName="backdrop-blur-md bg-white/90 border border-white/30"
      />
    </div>
  );
};

export default AuthLayout;
