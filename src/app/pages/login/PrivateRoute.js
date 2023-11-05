import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const privateUrls = ["/boards", "/boards/:id", "/", "/profile"];

function PrivateRoute({ path, element: Component }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated() && (path === "/login" || path === "/register"))
    path = "/";

  let hasAccess = false;
  if (path === "/" || privateUrls.includes(path)) {
    hasAccess = isAuthenticated();
  }

  return <>{hasAccess ? <Component /> : <Navigate to="/access-denied" />}</>;
}

export default PrivateRoute;
