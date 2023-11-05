import React, { useState } from "react";
import { Modal, Form, Button, Message } from "semantic-ui-react";

const BoardModal = ({ open, onClose, onSubmit, isEditing, initialBoard }) => {
  const [board, setBoard] = useState(
    initialBoard || { boardId: null, title: "", description: "" }
  );
  const [errors, setErrors] = useState({ title: "", description: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const handleFormSubmit = () => {
    // Validation logic here...

    // Call onSubmit prop with the board data
    onSubmit(board);
  };

  return (
    <Modal open={open} onClose={onClose} size="tiny">
      <Modal.Header>
        {isEditing ? "Edit Board" : "Create a New Board"}
      </Modal.Header>
      <Modal.Content>
        {successMessage && (
          <Message positive>
            <Message.Header>{successMessage}</Message.Header>
          </Message>
        )}
        <Form>{/* Form fields here... */}</Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button primary onClick={handleFormSubmit}>
          {isEditing ? "Update" : "Create"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default BoardModal;
