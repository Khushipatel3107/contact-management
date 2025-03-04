import { redirect } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export const loginLoader = async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || !role) {
    return null;
  } else {
    return redirect("/" + role);
  }
};
export const verifyLoader = async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const permissions = localStorage.getItem("permissions")?.split(",");
  console.log(permissions);
  console.log(!permissions);
  console.log(role == "user" && !permissions);
  if (!token || !role) {
    return redirect("/");
  } else {
    const url = `${apiUrl}/api/v1/${role}/verify`;
    const request = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    const response = await request.json();
    if (response.success && response.data.role == role) {
      localStorage.setItem("fullname", response.data.fullname);
      localStorage.setItem("role", response.data.role);
      if (role == "user") {
        localStorage.setItem("permissions", response.data.permissions);
      }
      return null;
    } else {
      localStorage.clear();
      return null;
    }
  }
};
