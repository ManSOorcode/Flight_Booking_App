const AdminHeader = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/auth";
  };

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  return (
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <button
        onClick={onMenuClick}
        className="md:hidden text-gray-700 focus:outline-none"
      >
        {/* <Menu size={24} /> */}
        click
      </button>
      <h1 className="text-lg font-semibold text-gray-700">
        Welcome, {user?.name || "Admin"}
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;
