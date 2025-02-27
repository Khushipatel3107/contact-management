import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-darkBlue text-white p-5">
        <div className="text-center text-2xl font-semibold mb-6">
          Admin Dashboard
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/admin/users"
                className="hover:bg-gray-700 p-2 block rounded"
              >
                User
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/users"
                className="hover:bg-gray-700 p-2 block rounded"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/settings"
                className="hover:bg-gray-700 p-2 block rounded"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/reports"
                className="hover:bg-gray-700 p-2 block rounded"
              >
                Reports
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/logout"
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
