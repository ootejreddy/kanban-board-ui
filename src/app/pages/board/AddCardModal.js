import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Dropdown,
  Message,
} from "semantic-ui-react";
import api from "../../api/api";
import { useParams } from "react-router-dom";

function AddCardModal({ open, onClose, onAddCard, columnId, users }) {
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [storyPoints, setStoryPoints] = useState("");
  const [assignee, setAssignee] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { id } = useParams();

  const assigneeOptions = users.map((user) => ({
    key: user.userId,
    text: user.firstName + " " + user.lastName,
    value: user.userId,
  }));

  const handleAddCard = async () => {
    if (!cardTitle || !assignee) {
      setError("Title and Assignee are required fields.");
      return;
    }

    try {
      const response = await api.post(
        `/boards/${id}/columns/${columnId}/cards`,
        {
          title: cardTitle,
          description: cardDescription,
          points: storyPoints,
          assignedUserId: assignee,
        }
      );

      const newCard = response.data;
      onAddCard(newCard);
      onClose();
      setSuccess("Card added successfully!"); // Set the success message
    } catch (error) {
      console.error("Error adding card: ", error);
      setError("Error adding card. Please try again."); // Set an error message
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setError("");
        setSuccess("");
        onClose();
      }}
      size="tiny"
    >
      <Modal.Header>Add Card</Modal.Header>
      <Modal.Content>
        <Form error={!!error} success={!!success}>
          <Form.Field>
            <label>Title</label>
            <Input
              placeholder="Enter title"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <Input
              placeholder="Enter description"
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Story Points</label>
            <Input
              type="number"
              placeholder="Enter story points"
              value={storyPoints}
              onChange={(e) => setStoryPoints(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Assignee</label>
            <Dropdown
              placeholder="Select assignee"
              fluid
              search
              selection
              options={assigneeOptions}
              value={assignee}
              onChange={(e, data) => setAssignee(data.value)}
            />
          </Form.Field>
          <Message error content={error} />
          <Message success content={success} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="black"
          onClick={() => {
            setError("");
            setSuccess("");
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          primary
          icon="checkmark"
          labelPosition="right"
          content="Add Card"
          onClick={handleAddCard}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default AddCardModal;
