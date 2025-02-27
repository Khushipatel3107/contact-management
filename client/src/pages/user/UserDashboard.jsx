import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-darkBlue text-white p-5">
        <div className="text-center text-2xl font-semibold mb-6">
          User Dashboard
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                onClick={() => localStorage.clear()}
                className="hover:bg-gray-700 p-2 block rounded"
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
