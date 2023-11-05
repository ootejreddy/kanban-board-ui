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

function EditCardModal({
  open,
  onClose,
  onUpdate,
  onDelete,
  card,
  columnId,
  users,
}) {
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [storyPoints, setStoryPoints] = useState("");
  const [assignee, setAssignee] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const { id } = useParams();

  const assigneeOptions = users.map((user) => ({
    key: user.userId,
    text: user.firstName + " " + user.lastName,
    value: user.userId,
  }));

  useEffect(() => {
    if (card) {
      setCardTitle(card.title);
      setCardDescription(card.description);
      setStoryPoints(card.points.toString());
      setAssignee(card.assignedUserId);
    }
  }, [card]);

  const handleUpdateCard = async () => {
    if (!cardTitle || !assignee) {
      setError("Title and Assignee are required fields.");
      return;
    }

    try {
      const response = await api.put(
        `/boards/${id}/columns/${columnId}/cards/${card?.cardId}`,
        {
          title: cardTitle,
          description: cardDescription,
          points: parseInt(storyPoints),
          assignedUserId: parseInt(assignee),
        }
      );

      const updatedCard = response.data;

      setSuccessMessage("Card updated successfully!"); // Set success message
      setTimeout(() => {
        onUpdate(updatedCard);
        onClose();
        setSuccessMessage(""); // Reset success message after 1 second
      }, 1500);
    } catch (error) {
      console.error("Error updating card: ", error);
    }
  };

  const handleDeleteCard = async () => {
    try {
      await api.delete(
        `/boards/${id}/columns/${columnId}/cards/${card?.cardId}`
      );

      setSuccessMessage("Card deleted successfully!"); // Set success message
      setTimeout(() => {
        onDelete(card?.cardId, columnId);
        onClose();
        setSuccessMessage(""); // Reset success message after 1 second
      }, 1500);
    } catch (error) {
      console.error("Error deleting card: ", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setError("");
        onClose();
      }}
      size="tiny"
    >
      <Modal.Header>Edit Card</Modal.Header>
      <Modal.Content>
        <Form error={!!error} success={!!successMessage}>
          <Message error content={error} />
          <Message success content={successMessage} />
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
              selection
              options={assigneeOptions}
              value={assignee}
              onChange={(e, { value }) => setAssignee(value)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={handleDeleteCard}>
          Delete
        </Button>
        <Button
          color="black"
          onClick={() => {
            setError("");
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          primary
          icon="checkmark"
          labelPosition="right"
          content="Save"
          onClick={handleUpdateCard}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default EditCardModal;
