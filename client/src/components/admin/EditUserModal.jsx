import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const EditUserModal = ({
  show,
  user,
  onClose,
  availableDesignations = [],
  availableTeams = [],
  saveUser,
}) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    teamIds: [],
    designationIds: [],
    permissions: [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsEditMode(true);
      setFormData({
        fullname: user.fullname,
        email: user.email,
        teamIds: user.teamIds || [],
        designationIds: user.designationIds || [],
        permissions: user.permissions || [],
      });
    } else {
      setIsEditMode(false);
      setFormData({
        fullname: "",
        email: "",
        teamIds: [],
        designationIds: [],
        permissions: [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const url = isEditMode
      ? `${apiUrl}/api/v1/users/update/${user._id}`
      : `${apiUrl}/api/v1/users/create`;

    const method = isEditMode ? "PUT" : "POST";

    const payload = {
      fullname: formData.fullname,
      email: formData.email,
      teamIds: formData.teamIds,
      designationIds: formData.designationIds,
      permissions: formData.permissions,
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        saveUser(data.user);
        onClose();
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert("Failed to save user");
    }
  };

  return (
    <Dialog
      header={isEditMode ? "Edit User" : "Add New User"}
      visible={show}
      onHide={onClose}
      footer={
        <div>
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
          />
        </div>
      }
    >
      <div>
        <div className="p-field">
          <label htmlFor="fullname">Full Name</label>
          <InputText
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>

        <div className="p-field">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isEditMode}
          />
        </div>

        <div className="p-field">
          <label htmlFor="teams">Teams</label>
          <MultiSelect
            id="teams"
            name="teamIds"
            value={formData.teamIds}
            options={availableTeams}
            optionLabel="name"
            optionValue="_id"
            onChange={handleChange}
            placeholder="Select Teams"
          />
        </div>

        <div className="p-field">
          <label htmlFor="designations">Designations</label>
          <MultiSelect
            id="designations"
            name="designationIds"
            value={formData.designationIds}
            options={availableDesignations}
            optionLabel="name"
            optionValue="_id"
            onChange={handleChange}
            placeholder="Select Designations"
          />
        </div>

        <div className="p-field">
          <label htmlFor="permissions">Permissions</label>
          <InputTextarea
            id="permissions"
            name="permissions"
            value={formData.permissions.join(", ")}
            onChange={handleChange}
            rows={5}
            placeholder="Enter permissions (comma separated)"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default EditUserModal;
