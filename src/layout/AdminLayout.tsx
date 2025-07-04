import { Outlet, useLocation, useNavigate } from "react-router";
import AdminHeader from "../components/admin/navigation/AdminHeader";
import AdminSidebar from "../components/admin/navigation/AdminSidebar";
import { useEffect, useState } from "react";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/admin") navigate("/admin/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex h-screen w-full">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="bg-gray-50 p-6 overflow-y-auto h-full">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
