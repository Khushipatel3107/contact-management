import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
const apiUrl = import.meta.env.VITE_API_URL;

const EditUserModal = ({
  show,
  user,
  onClose,
  getUsers,
  availableDesignations = [],
  availableTeams = [],
}) => {
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    teamIds: [],
    designationIds: [],
    permissions: [],
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setError("");
    if (user) {
      setFormData({
        fullname: user.fullname,
        email: user.email,
        teamIds: user.teams ? user.teams.map((team) => team._id) : [],
        designationIds: user.designations
          ? user.designations.map((designation) => designation._id)
          : [],
        permissions: user.permissions || [],
      });
    } else {
      setFormData({
        fullname: "",
        email: "",
        teamIds: [],
        designationIds: [],
        permissions: [],
      });
    }
  }, [user, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "permissions") {
      const permissionsArray = Array.isArray(value)
        ? value
        : value.split(",").map((item) => item.trim());
      setFormData((prevData) => ({
        ...prevData,
        [name]: permissionsArray,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const permissionsOptions = [
    { label: "Create Contact", value: "CREATE_CONTACT" },
    { label: "Edit Contact", value: "EDIT_CONTACT" },
    { label: "Delete Contact", value: "DELETE_CONTACT" },
  ];

  const handleSubmit = async () => {
    const url = user
      ? `${apiUrl}/api/v1/admin/user/${user._id}`
      : `${apiUrl}/api/v1/admin/addUser`;

    const method = user ? "PUT" : "POST";

    const payload = {
      fullname: formData.fullname,
      email: formData.email,
      teams: formData.teamIds,
      designations: formData.designationIds,
      permissions: formData.permissions,
    };

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
        onClose();
        getUsers();
        setError("");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header={user ? "Edit User" : "Add New User"}
      visible={show}
      onHide={onClose}
      footer={
        <div className="space-x-5">
          <div className="text-red-600 text-center w-full text-xl">{error}</div>
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
          <label htmlFor="fullname">Full Name</label>
          <InputText
            id="fullname"
            className="w-full"
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
            className="w-full"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!!user}
          />
        </div>

        <div className="p-field">
          <label htmlFor="teams">Teams</label>
          <MultiSelect
            className="w-full"
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
            className="w-full"
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
          <MultiSelect
            id="permissions"
            name="permissions"
            value={formData.permissions}
            options={permissionsOptions}
            optionLabel="label"
            optionValue="value"
            onChange={handleChange}
            placeholder="Select Permissions"
            className="w-full"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default EditUserModal;
