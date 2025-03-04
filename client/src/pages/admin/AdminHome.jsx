import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();
  const activeClass = "border border-1 p-2 block rounded";
  const inactiveClass = "hover:bg-gray-700 p-2 block rounded";
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-darkBlue text-white p-5">
        <div className="text-center text-2xl font-semibold mb-6">Admin</div>
        <nav>
          <ul className="space-y-4">
            <li key="dashboard">
              <NavLink to="/admin">Dashboard</NavLink>
            </li>
            <li key="users">
              <NavLink
                to="users"
                className={({ isActive }) => {
                  return isActive ? activeClass : inactiveClass;
                }}
              >
                User
              </NavLink>
            </li>
            <li key="designations">
              <NavLink
                to="designations"
                className={({ isActive }) => {
                  return isActive ? activeClass : inactiveClass;
                }}
              >
                Designations
              </NavLink>
            </li>
            <li key="teams">
              <NavLink
                to="teams"
                className={({ isActive }) => {
                  return isActive ? activeClass : inactiveClass;
                }}
              >
                Teams
              </NavLink>
            </li>
            <li key="contacts">
              <NavLink
                to="contacts"
                className={({ isActive }) => {
                  return isActive ? activeClass : inactiveClass;
                }}
              >
                Contacts
              </NavLink>
            </li>
            <li key="logout">
              <NavLink
                to={"/"}
                onClick={() => {
                  localStorage.clear();
                }}
                className={({ isActive }) => {
                  return isActive ? activeClass : inactiveClass;
                }}
              >
                Logout
              </NavLink>
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
