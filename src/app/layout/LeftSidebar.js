import React from "react";
import { Icon, Menu, Sidebar } from "semantic-ui-react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  return (
    <div style={{ top: "50px" }}>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={true}
        width="thin"
        style={{
          position: "fixed",
          bottom: 0,
          top: "60px",
          height: "calc(100vh - 60px)",
        }}
      >
        <Menu.Item as={Link} to="/boards" style={{ marginRight: 20 }}>
          <Icon name="list" />
          Boards
        </Menu.Item>
        <Menu.Item as={Link} to="/profile" style={{ marginRight: 20 }}>
          <Icon name="user" />
          Profile
        </Menu.Item>
      </Sidebar>
    </div>
  );
};

export default LeftSidebar;
