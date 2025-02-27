import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export const ConfirmationDialog = ({ visible, onConfirm, onCancel }) => {
  return (
    <Dialog
      visible={visible}
      onHide={onCancel}
      header="Confirm Deletion"
      footer={
        <div>
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={onCancel}
            className="p-button-text"
          />
          <Button
            label="Confirm"
            icon="pi pi-check"
            onClick={onConfirm}
            autoFocus
          />
        </div>
      }
    >
      <p>Are you sure you want to delete this user?</p>
    </Dialog>
  );
};
