import React from "react";
import { Container } from "semantic-ui-react";
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext";
import LeftSidebar from "./LeftSidebar";

const layoutStyle = {
  display: "flex",
  flexDirection: "column", // Stack items vertically
  minHeight: "100vh", // Make sure the layout covers the full height of the viewport
};

const contentStyle = {
  flex: 1,
  marginTop: "20px", // Adjust the top margin based on your header's height,
  marginLeft: 150,
};

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={layoutStyle}>
      <Header />
      {isAuthenticated() && <LeftSidebar />}
      <div style={isAuthenticated() ? contentStyle : {}}>{children}</div>
    </div>
  );
};

export default Layout;
