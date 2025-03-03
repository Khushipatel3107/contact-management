import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import { InputText } from "primereact/inputtext";
import ContactModal from "../../components/admin/contacts/ContactModal";
const apiUrl = import.meta.env.VITE_API_URL;

const Contacts = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [globalFilter, setGlobalFilter] = useState();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteContact, setDeleteContact] = useState(null);

  const getContacts = async () => {
    const url = `${apiUrl}/api/v1/${role}/contact`;
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
            contactEmail: ele.email[0],
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
    getContacts();
  }, []);

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleDelete = (contact) => {
    setDeleteContact(contact);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/${role}/contact`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ contactId: deleteContact._id }),
      });
      const data = await response.json();
      if (data.success) {
        getContacts();
      } else {
        setError("Failed to delete contact");
      }
    } catch (error) {
      setError("Failed to delete contact");
    }
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const handleCloseEditModal = () => {
    setShowContactModal(false);
    setSelectedContact(null);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowContactModal(true);
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
          <Column field="contactEmail" header="Email" />
          <Column field="contactNumber" header="Contact Number" />
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
          <div className="text-4xl font-bold">Contacts</div>
          <Button
            className="bg-darkBlue border-0 rounded-md"
            label="ADD CONTACT"
            onClick={handleAddContact}
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
      <ContactModal
        show={showContactModal}
        contact={selectedContact}
        onClose={handleCloseEditModal}
        getContacts={getContacts}
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

export default Contacts;
