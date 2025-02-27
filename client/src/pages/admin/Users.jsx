import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmationDialog } from "../../components/admin/ConfirmationDialog";
import EditUserModal from "../../components/admin/EditUserModal";
const apiUrl = import.meta.env.VITE_API_URL;

const Users = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [availableDesignations, setAvailableDesignations] = useState([]);

  // Function to fetch users
  const getUsers = async () => {
    const url = `${apiUrl}/api/v1/${role}/users`;
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
        setData(
          response.data.map((ele, ind) => ({
            ...ele,
            index: ind + 1,
            fullname: ele.fullname,
            email: ele.email,
            designationNames: ele.designations.length
              ? ele.designations
                  .map((designation) => designation.name)
                  .join(", ")
              : "-",
            teamNames: ele.teams.length
              ? ele.teams.map((team) => team.name).join(", ")
              : "-",
            permissions: ele.permissions || "-",
            permissionNames:
              ele.permissions && Array.isArray(ele.permissions)
                ? Array.from(new Set(ele.permissions)).join(", ")
                : "-",
          }))
        );
      } else {
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      setError("Failed to fetch data");
    }
  };

  const getTeams = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/${role}/team`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAvailableTeams(data.data);
      } else {
        setError("Failed to fetch teams");
      }
    } catch (error) {
      setError("Failed to fetch teams");
    }
  };

  const getDesignations = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/${role}/designation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAvailableDesignations(data.data);
      } else {
        setError("Failed to fetch designations");
      }
    } catch (error) {
      setError("Failed to fetch designations");
    }
  };

  useEffect(() => {
    getUsers();
    getTeams();
    getDesignations();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setDeleteUser(user);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/v1/${role}/user/${deleteUser._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        getUsers();
      } else {
        setError("Failed to fetch designations");
      }
    } catch (error) {
      setError("Failed to fetch designations");
    }
    setShowDeleteDialog(false);
    getUsers();
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowEditModal(true);
  };

  let component = <></>;
  if (loading)
    component = (
      <div className="w-full text-center py-10">
        <ProgressSpinner />
      </div>
    );
  else if (error)
    component = (
      <div className="text-red-600 text-center w-full text-xl">{error}</div>
    );
  else
    component = (
      <div className="card">
        <DataTable
          value={data}
          paginator
          rows={10}
          globalFilter={globalFilter}
          responsiveLayout="scroll"
          selectionMode="single"
        >
          <Column field="index" header="Index" style={{ width: "60px" }} />
          <Column field="fullname" header="Fullname" />
          <Column field="email" header="Email" />
          <Column field="designationNames" header="Designations" />
          <Column field="teamNames" header="Teams" />
          <Column field="permissionNames" header="Permissions" />
          <Column
            header="Actions"
            body={(rowData) => (
              <div>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-info mr-2"
                  onClick={() => handleEdit(rowData)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger"
                  onClick={() => handleDelete(rowData)}
                />
              </div>
            )}
          />
        </DataTable>
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="text-4xl font-bold">Users</div>
        <Button
          className="bg-darkBlue border-0 rounded-md"
          label="ADD USER"
          onClick={handleAddUser}
        />
      </div>
      {component}
      <EditUserModal
        show={showEditModal}
        user={selectedUser}
        onClose={handleCloseEditModal}
        availableDesignations={availableDesignations}
        availableTeams={availableTeams}
        getUsers={getUsers}
        setError={setError}
      />
      <ConfirmationDialog
        visible={showDeleteDialog}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Users;
