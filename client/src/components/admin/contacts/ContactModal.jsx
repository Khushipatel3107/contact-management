import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

const ContactModal = ({ show, contact, onClose, getContacts }) => {
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
  });

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
    } else if (!formData.email) {
      setError("Enter email");
      return;
    } else if (!formData.contactNumber) {
      setError("Enter contact number");
      return;
    }

    const method = contact ? "PUT" : "POST";
    let payload = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
    };
    if (contact) {
      payload = { ...payload, contactId: contact._id };
    }
    const url = `${apiUrl}/api/v1/admin/contact`;
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
        getContacts();
        setError("");
        onClose();
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to save contact");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError("");
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        contactNumber: contact.contactNumber,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        contactNumber: "",
      });
    }
  }, [show, contact]);

  return (
    <Dialog
      header={contact ? "Edit Contact" : "Add New Contact"}
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
      <div className="space-y-4">
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
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            className="w-full"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="p-field">
          <label htmlFor="contactNumber">Contact Number</label>
          <InputText
            id="contactNumber"
            className="w-full"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </Dialog>
  );
};

export default ContactModal;
