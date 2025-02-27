import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmationDialog } from "../../components/admin/ConfirmationDialog"; // Import the Delete Confirmation Modal
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
              : "-", // Show "-" if no teams
            permissions: ele.permissions || "-", // Show permissions
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

  useEffect(() => {
    getUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setDeleteUser(user);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    console.log(`Deleting user with id: ${deleteUser._id}`);
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

  const handleSaveEditedUser = async (updatedUserData) => {
    const url = `${apiUrl}/api/v1/${role}/users/${updatedUserData._id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(updatedUserData),
    });

    const data = await response.json();
    if (data.success) {
      getUsers();
      setShowEditModal(false);
    } else {
      setError("Failed to update user");
    }
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
          <Column field="permissions" header="Permissions" />
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
          onClick={handleAddUser} // Trigger the Add User modal
        />
      </div>
      {component}
      <EditUserModal
        show={showEditModal}
        user={selectedUser}
        onClose={handleCloseEditModal}
        saveUser={handleSaveEditedUser}
        availableDesignations={availableDesignations}
        availableTeams={availableTeams}
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
