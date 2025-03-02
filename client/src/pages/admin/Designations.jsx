import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import { InputText } from "primereact/inputtext";
import DesignationModal from "../../components/admin/designations/DesignationModal";
const apiUrl = import.meta.env.VITE_API_URL;

const Designations = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [globalFilter, setGlobalFilter] = useState();
  const [showDesignationModal, setShowDesignationModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDesignation, setDeleteDesignation] = useState(null);

  const getDesignations = async () => {
    const url = `${apiUrl}/api/v1/${role}/designation`;
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
            permissionNames:
              ele.permissions &&
              Array.isArray(ele?.permissions) &&
              ele.permissions.length
                ? Array.from(new Set(ele?.permissions)).join(", ")
                : "-",
          }))
        );
      } else {
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    getDesignations();
  }, []);

  const handleEdit = (designation) => {
    setSelectedDesignation(designation);
    setShowDesignationModal(true);
  };

  const handleDelete = (designation) => {
    setDeleteDesignation(designation);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/${role}/designation`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ designationId: deleteDesignation._id }),
      });
      const data = await response.json();
      if (data.success) {
        getDesignations();
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
    setShowDesignationModal(false);
    setSelectedDesignation(null);
  };

  const handleAddDesignation = () => {
    setSelectedDesignation(null);
    setShowDesignationModal(true);
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
          <Column field="index" header="Index" />
          <Column field="name" header="Name" />
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
      <div className="my-6">
        <div className="flex justify-between items-center mb-5">
          <div className="text-4xl font-bold">Designations</div>
          <Button
            className="bg-darkBlue border-0 rounded-md"
            label="ADD DESIGNATION"
            onClick={handleAddDesignation}
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
      <DesignationModal
        show={showDesignationModal}
        designation={selectedDesignation}
        onClose={handleCloseEditModal}
        getDesignations={getDesignations}
      />
      <ConfirmationDialog
        message={"Are you sure you want to delete?"}
        header={"Confirm deletion"}
        visible={showDeleteDialog}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Designations;
