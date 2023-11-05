import React, { useState } from "react";
import { Grid, Header, Button, Divider, Icon } from "semantic-ui-react";
import KanbanCard from "./KanbanCard";
import AddCardModal from "./AddCardModal";
import EditColumnModal from "./EditColumnModal";
import EditCardModal from "./EditCardModal"; // Import the EditCardModal component
import api from "../../api/api";
import { useParams } from "react-router-dom";

function KanbanColumn({
  column = {},
  columns,
  setColumns,
  onColumnDrop,
  users,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [editColumnModalOpen, setEditColumnModalOpen] = useState(false);
  const [editCard, setEditCard] = useState(null); // State to store the card being edited
  const [editCardModalOpen, setEditCardModalOpen] = useState(false); // State to control the edit card modal
  const { id } = useParams();

  const handleCardDragStart = (e, cardId) => {
    e.dataTransfer.setData("itemType", "card");
    e.dataTransfer.setData("cardId", cardId);
    e.dataTransfer.setData("sourceColumnId", column.columnId);
  };

  const handleCardDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const taskId = parseInt(e.dataTransfer.getData("cardId"));
    const sourceColumnName = parseInt(e.dataTransfer.getData("sourceColumnId"));

    if (sourceColumnName === column.columnId) {
      return;
    }
    const movedCard =
      columns
        .find((col) => col.columnId === sourceColumnName)
        .cards.find((card) => card.cardId === taskId) || {};

    await api
      .put(`/boards/${id}/columns/${sourceColumnName}/cards/${taskId}`, {
        ...movedCard,
        columnId: column.columnId,
      })
      .then((response) => {
        console.log("Card position updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating card position: ", error);
      });

    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((col) => {
        if (col.columnId === sourceColumnName && taskId) {
          return {
            ...col,
            cards: col.cards.filter((card) => card.cardId !== taskId),
          };
        }

        if (col.columnId === column.columnId && taskId) {
          const shiftedCard = prevColumns
            .find((col) => col.columnId === sourceColumnName)
            .cards.find((card) => card.cardId === taskId);

          return {
            ...col,
            cards: [
              ...col.cards,
              { ...shiftedCard, columnId: column.columnId },
            ],
          };
        }

        return col;
      });

      return [...updatedColumns];
    });
  };

  const handleColumnDragStart = (e) => {
    e.dataTransfer.setData("columnId", column.columnId);
  };

  const openEditColumnModal = () => {
    setEditColumnModalOpen(true);
  };

  const closeEditColumnModal = (deletedCardId) => {
    const updatedColumns = columns.map((col) => ({
      ...col,
      cards: col.cards.filter((card) => card.cardId !== deletedCardId),
    }));

    setColumns(updatedColumns);
    setEditColumnModalOpen(false);
  };

  const handleEditColumn = async (updatedColumn) => {
    try {
      await api.put(`/boards/${id}/columns/${updatedColumn.columnId}`, {
        name: updatedColumn.name,
      });

      const updatedColumns = columns.map((col) => {
        if (col.columnId === updatedColumn.columnId) {
          col.name = updatedColumn.name;
        }
        return col;
      });

      // Set the updated columns to the state
      setColumns([...updatedColumns]);
      closeEditColumnModal();
    } catch (error) {
      console.error("Error updating column: ", error);
      // Handle error here, e.g., show an error message to the user
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await api.delete(`/boards/${id}/columns/${column.columnId}`);
      const updatedColumns = columns.filter(
        (col) => col.columnId !== column.columnId
      );
      setColumns(updatedColumns);
    } catch (error) {
      console.error("Error deleting column: ", error);
      // Handle error here, e.g., show an error message to the user
    }
  };

  const openAddCardModal = () => {
    setOpenModal(true);
  };

  const closeAddCardModal = () => {
    setOpenModal(false);
  };

  const openEditCardModal = (card) => {
    setEditCard(card);
    setEditCardModalOpen(true);
  };

  const closeEditCardModal = () => {
    setEditCard(null);
    setEditCardModalOpen(false);
  };

  const handleEditCard = async (updatedCard) => {
    try {
      const updatedColumns = columns.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card.cardId === updatedCard.cardId ? updatedCard : card
        ),
      }));

      setColumns(updatedColumns);
      closeEditCardModal();
    } catch (error) {
      console.error("Error updating card: ", error);
    }
  };

  const handleAddCard = (newCard) => {
    setColumns((prevColumns) => {
      const updatedColumns = prevColumns.map((col) => {
        if (col.columnId === column.columnId) {
          return {
            ...col,
            cards: [...col.cards, newCard],
          };
        }
        return col;
      });

      return [...updatedColumns];
    });
  };

  const handleColumnDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedItemType = e.dataTransfer.getData("itemType");

    if (droppedItemType === "card") {
      handleCardDrop(e);
      return;
    }

    const droppedItemId = parseInt(e.dataTransfer.getData("itemId"));

    if (droppedItemType === "card" && !isNaN(droppedItemId)) {
      handleCardDrop(e);
    } else {
      const sourceColumnId = parseInt(e.dataTransfer.getData("columnId"));
      const sourceCol = columns.find(
        ({ columnId }) => columnId === sourceColumnId
      );
      const sourcePostion = sourceCol.position;

      const droppedCol = columns.find(
        ({ columnId }) => columnId === column.columnId
      );

      await api.put(`/boards/${id}/columns/${sourceColumnId}`, {
        ...sourceCol,
        position: droppedCol.position,
      });

      await api.put(`/boards/${id}/columns/${column.columnId}`, {
        ...droppedCol,
        position: sourcePostion,
      });

      if (sourceColumnId !== column.columnId) {
        const draggedColumnIndex = columns.findIndex(
          (col) => col.columnId === sourceColumnId
        );
        const droppedColumnIndex = columns.findIndex(
          (col) => col.columnId === column.columnId
        );
        onColumnDrop(draggedColumnIndex, droppedColumnIndex);
      }
    }
  };

  const cards = columns.find((col) => col.columnId === column.columnId).cards;

  return (
    <Grid.Column
      className="kanban-column"
      onDragStart={(e) => handleColumnDragStart(e)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleColumnDrop}
      draggable
      style={{
        minWidth: 260,
        maxWidth: 260,
        padding: "0 8px",
      }}
    >
      <div
        style={{
          border: "1px solid black",
          marginBottom: "16px",
          borderRadius: "8px",
          backgroundColor: "#F4F5F7",
        }}
      >
        <Header
          as="h3"
          className="kanban-column-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <span style={{ flex: 1, textAlign: "center" }}>{column.name}</span>
          <Icon
            name="edit"
            style={{ cursor: "pointer", fontSize: "13px", marginRight: "10px" }}
            onClick={openEditColumnModal}
          />
        </Header>

        <Divider
          style={{
            marginBottom: "12px",
            width: "100%",
          }}
        />
        <div style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
          {cards &&
            cards.map((task) => (
              <KanbanCard
                key={task.cardId}
                card={task}
                columnId={column.columnId}
                onDragStart={(e) => handleCardDragStart(e, task.cardId)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleCardDrop}
                openEditCardModal={openEditCardModal} // Pass the edit card function to the KanbanCard component
              />
            ))}
          <div style={{ marginTop: 16 }}>
            <Button color="instagram" fluid onClick={openAddCardModal}>
              <i className="plus icon" /> Add a card
            </Button>
          </div>
        </div>
        <AddCardModal
          open={openModal}
          onClose={closeAddCardModal}
          onAddCard={handleAddCard}
          columnId={column.columnId}
          users={users}
        />
        <EditColumnModal
          open={editColumnModalOpen}
          onClose={closeEditColumnModal}
          column={column}
          onDelete={handleDeleteColumn}
          onUpdate={handleEditColumn}
        />
        <EditCardModal
          open={editCardModalOpen}
          onClose={closeEditCardModal}
          onUpdate={handleEditCard}
          card={editCard}
          columnId={column.columnId}
          onDelete={closeEditColumnModal}
          users={users}
        />
      </div>
    </Grid.Column>
  );
}

export default KanbanColumn;
