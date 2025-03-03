import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
const apiUrl = import.meta.env.VITE_API_URL;

const TeamModal = ({ show, team, onClose, getTeams, availableUsers = [] }) => {
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
    memberIds: [],
  });

  useEffect(() => {
    setError("");
    if (team) {
      setFormData({
        name: team.name,
        permissions: team.permissions || [],
        memberIds: team.members ? team.members.map((member) => member._id) : [],
      });
    } else {
      setFormData({
        name: "",
        permissions: [],
        memberIds: [],
      });
    }
  }, [team, show]);

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
    const url = team
      ? `${apiUrl}/api/v1/admin/team`
      : `${apiUrl}/api/v1/admin/team`;
    const method = team ? "PUT" : "POST";

    let payload = {
      name: formData.name,
      permissions: formData.permissions,
      members: formData.memberIds,
    };

    if (method == "PUT") {
      payload = { ...payload, teamId: team._id };
    }

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
        getTeams();
        setError("");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to save team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header={team ? "Edit Team" : "Add New Team"}
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
          <label htmlFor="name">Team Name</label>
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

        <div className="p-field">
          <label htmlFor="members">Team Members</label>
          <MultiSelect
            id="members"
            name="memberIds"
            value={formData.memberIds}
            options={availableUsers}
            optionLabel="fullname"
            optionValue="_id"
            onChange={handleChange}
            placeholder="Select Team Members"
            className="w-full"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default TeamModal;
