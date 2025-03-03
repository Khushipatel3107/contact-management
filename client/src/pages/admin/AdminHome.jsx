import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-darkBlue text-white p-5">
        <div className="text-center text-2xl font-semibold mb-6">Admin</div>
        <nav>
          <ul className="space-y-4">
            <li key="dashboard">
              <Link to="/admin" className="hover:bg-gray-700 p-2 block rounded">
                Dashboard
              </Link>
            </li>
            <li key="users">
              <Link to="users" className="hover:bg-gray-700 p-2 block rounded">
                User
              </Link>
            </li>
            <li key="designations">
              <Link
                to="designations"
                className="hover:bg-gray-700 p-2 block rounded"
              >
                Designations
              </Link>
            </li>
            <li key="teams">
              <Link to="teams" className="hover:bg-gray-700 p-2 block rounded">
                Teams
              </Link>
            </li>
            <li key="contacts">
              <Link
                to="contacts"
                className="hover:bg-gray-700 p-2 block rounded"
              >
                Contacts
              </Link>
            </li>
            <li key="logout">
              <Link
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
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

export default AdminHome;
