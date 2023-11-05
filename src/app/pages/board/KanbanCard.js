import React from "react";
import { Card } from "semantic-ui-react";

function KanbanCard({
  card = {},
  columnId,
  onDragStart,
  onDragOver,
  onDrop,
  openEditCardModal,
}) {
  const handleEditClick = () => {
    openEditCardModal(card);
  };

  return (
    <>
      <Card
        key={card.cardId}
        fluid
        draggable
        onDragStart={(e) => onDragStart(e, card.cardId, columnId)}
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => {
          e.preventDefault();
          onDrop(e);
        }}
        style={{
          marginRight: 5,
          borderRadius: 8,
          cursor: "pointer",
          backgroundColor: "white",
        }}
        onClick={handleEditClick}
      >
        <Card.Content>
          <Card.Header style={{ color: "black", fontSize: "14px" }}>
            {card.title}
          </Card.Header>
          <Card.Description>{card.description}</Card.Description>
        </Card.Content>
      </Card>
    </>
  );
}

export default KanbanCard;
