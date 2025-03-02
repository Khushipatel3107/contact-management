import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export const ConfirmationDialog = ({
  visible,
  onConfirm,
  onCancel,
  message,
  header,
}) => {
  return (
    <Dialog
      className="w-[30%]"
      visible={visible}
      onHide={onCancel}
      header={header}
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
      <p>{message}</p>
    </Dialog>
  );
};
