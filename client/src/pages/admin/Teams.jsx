import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import TeamModal from "../../components/admin/teams/TeamModal";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";

const apiUrl = import.meta.env.VITE_API_URL;

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/api/v1/admin/team`, {
        headers: {
          token,
        },
      });
      const data = await response.json();
      setLoading(false);
      if (data.success) {
        console.log(
          data.data.map((ele, index) => ({
            ...ele,
            index: index + 1,
            permissionNames:
              ele.permissions &&
              Array.isArray(ele.permissions) &&
              ele.permissions.length
                ? Array.from(new Set(ele.permissions)).join(", ")
                : "-",
          }))
        );
        setTeams(
          data.data.map((ele, index) => ({
            ...ele,
            index: index + 1,
            permissionNames:
              ele.permissions &&
              Array.isArray(ele.permissions) &&
              ele.permissions.length
                ? Array.from(new Set(ele.permissions)).join(", ")
                : "-",
          }))
        );
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/api/v1/admin/users`, {
        headers: {
          token,
        },
      });
      const data = await response.json();
      setAvailableUsers(data.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleAddTeam = () => {
    setSelectedTeam(null);
    setShowTeamModal(true);
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setShowTeamModal(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/api/v1/admin/team`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ teamId: selectedTeam._id }),
      });
      const data = await response.json();
      if (data.success) {
        fetchTeams();
      }
    } catch (error) {
      console.log(error);
    }
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const handleDelete = (team) => {
    setSelectedTeam(team);
    setShowDeleteDialog(true);
  };

  const handleCloseModal = () => {
    setShowTeamModal(false);
    setSelectedTeam(null);
  };
  let component = <></>;

  if (loading) {
    component = (
      <div className="w-full text-center py-10">
        <ProgressSpinner />
      </div>
    );
  } else if (error) {
    component = (
      <div className="text-red-600 text-center w-full text-xl">{error}</div>
    );
  } else {
    component = (
      <DataTable
        value={teams}
        paginator
        rows={10}
        responsiveLayout="scroll"
        globalFilter={globalFilter}
      >
        <Column field="index" header="Index" />
        <Column field="name" header="Team Name" />
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
    );
  }

  return (
    <div>
      <div className="my-6">
        <div className="flex justify-between items-center mb-5">
          <div className="text-4xl font-bold">Teams</div>
          <Button
            className="bg-darkBlue border-0 rounded-md"
            label="ADD TEAM"
            onClick={handleAddTeam}
          />
        </div>
      </div>
      <div className="p-field text-start my-4">
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search"
        />
      </div>
      {component}
      <TeamModal
        show={showTeamModal}
        team={selectedTeam}
        onClose={handleCloseModal}
        getTeams={fetchTeams}
        availableUsers={availableUsers}
      />

      <ConfirmationDialog
        message={"Are you sure you want to delete this team?"}
        header={"Confirm deletion"}
        visible={showDeleteDialog}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Teams;
