import React from "react";
import { Container, Image, Menu, Segment } from "semantic-ui-react";
import LogoImage from "../images/logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Segment inverted secondary>
      <Menu fixed="top" inverted>
        <Menu.Item
          as={Link}
          to={isAuthenticated() ? "/boards" : "/login"}
          header
          style={{
            border: "none",
          }}
        >
          <Image size="mini" src={LogoImage} style={{ marginRight: "0.8em" }} />{" "}
          Kanban Board
        </Menu.Item>
        <Menu.Menu position="right">
          {isAuthenticated() ? (
            <>
              <Menu.Item as={Link} to="/logout" style={{ marginRight: 20 }}>
                Logout
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item as={Link} to="/register" style={{ marginRight: 20 }}>
                Register
              </Menu.Item>
              <Menu.Item as={Link} to="/login" style={{ marginRight: 20 }}>
                Login
              </Menu.Item>
            </>
          )}
        </Menu.Menu>
      </Menu>
    </Segment>
  );
};

export default Header;
