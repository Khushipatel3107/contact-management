import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import UserDashboard from "./pages/user/UserDashboard";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { loginLoader, verifyLoader } from "./loader/verify-loader";
import Users from "./pages/admin/Users";

const routes = createBrowserRouter([
  {
    path: "/",
    loader: loginLoader,
    element: <Login />,
  },
  {
    path: "/admin",
    loader: verifyLoader,
    element: <AdminDashboard />,
    children: [{ path: "users", element: <Users /> }],
  },
  {
    path: "/user",
    loader: verifyLoader,
    element: <Home />,
    children: [{ path: "", element: <UserDashboard /> }],
  },
  {
    path: "*",
    loader: loginLoader,
    element: <Home />,
  },
]);
export default routes;
