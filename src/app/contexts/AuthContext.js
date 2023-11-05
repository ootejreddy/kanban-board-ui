import jwt_decode from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = ({ token, userId }) => {
    localStorage.setItem("token", token);
    setToken(token);
    getUser(userId).then((user) => {
      setUser(user);
    });
  };

  const logout = () => {
    console.log("logout is called");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return token !== null && token !== undefined;
  };

  const isAdmin = () => {
    return isAuthenticated() && user?.role === "ROLE_ADMIN";
  };

  const getUser = async (userId) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      if (isAuthenticated()) {
        setIsLoading(true);
        const decodedToken = jwt_decode(token || localStorage.getItem("token"));
        const user = await getUser(decodedToken?.userId);
        setUser(user);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    onLoad();
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
