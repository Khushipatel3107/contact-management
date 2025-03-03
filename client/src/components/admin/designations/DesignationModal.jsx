import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

const DesignationModal = ({ show, designation, onClose, getDesignations }) => {
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
  });
  const permissionsOptions = [
    { label: "Create Contact", value: "CREATE_CONTACT" },
    { label: "Edit Contact", value: "EDIT_CONTACT" },
    { label: "Delete Contact", value: "DELETE_CONTACT" },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    if (!formData.name) {
      setError("Enter name");
      return;
    } else if (!formData.permissions.length) {
      setError("Select permission");
      return;
    }
    const method = designation ? "PUT" : "POST";
    let payload = {
      name: formData.name,
      permissions: formData.permissions,
    };
    if (designation) {
      payload = { ...payload, designationId: designation._id };
    }
    const url = `${apiUrl}/api/v1/admin/designation`;
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        getDesignations();
        setError("");
        onClose();
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to save user");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setError("");
    if (designation) {
      setFormData({
        name: designation.name,
        permissions: designation.permissions || [],
      });
    } else {
      setFormData({
        name: "",
        designationIds: [],
        permissions: [],
      });
    }
  }, [show, designation]);
  return (
    <>
      <Dialog
        header={designation ? "Edit Designation" : "Add New Designation"}
        visible={show}
        onHide={onClose}
        footer={
          <div className="space-x-5">
            <div className="text-red-600 text-center w-full text-xl">
              {error}
            </div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={onClose}
              className="p-button-text"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={handleSubmit}
              loading={loading}
              className="p-button-primary"
            />
          </div>
        }
        className="w-[40%]"
      >
        <div className="space-y-4 ">
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              className="w-full"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="p-field">
            <label htmlFor="permissions">Permissions</label>
            <MultiSelect
              className="w-full"
              id="permissions"
              name="permissions"
              value={formData.permissions}
              options={permissionsOptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleChange}
              placeholder="Select Permissions"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DesignationModal;
