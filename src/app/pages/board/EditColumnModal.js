import React, { useState } from "react";
import { Modal, Form, Input, Button } from "semantic-ui-react";

function EditColumnModal({ open, onClose, column, onUpdate, onDelete }) {
  const [editedColumn, setEditedColumn] = useState({ ...column });

  const handleUpdate = () => {
    onUpdate(editedColumn);
  };

  const handleDelete = () => {
    onDelete(column.id);
  };

  return (
    <Modal open={open} onClose={onClose} size="tiny">
      <Modal.Header>Edit Column</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Column Title</label>
            <Input
              placeholder="Edit column name"
              value={editedColumn.name}
              onChange={(e) =>
                setEditedColumn({ ...editedColumn, name: e.target.value })
              }
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={handleDelete}>
          Delete
        </Button>
        <Button color="black" onClick={onClose}>
          Cancel
        </Button>
        <Button
          primary
          icon="checkmark"
          labelPosition="right"
          content="Update"
          onClick={handleUpdate}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default EditColumnModal;
