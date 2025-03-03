import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountCard from "../../components/CountCard";
import { ProgressSpinner } from "primereact/progressspinner";
const apiUrl = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [loading, setLoading] = useState(false);

  const getCounts = async () => {
    const url = `${apiUrl}/api/v1/${role}/counts`;
    setLoading(true);
    try {
      const request = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      const response = await request.json();
      setLoading(false);
      if (response.success) {
        setData(response.data);
      } else {
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    getCounts();
  }, []);
  if (loading) {
    return <ProgressSpinner />;
  }
  return (
    <div className="flex my-11">
      <div className="flex justify-center w-full flex-col">
        <div className="grid grid-cols-2 gap-4 w-full h-full">
          {Object.entries(data).map(([key, value]) => (
            <CountCard label={key} count={value} key={key} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
