import React, { createContext, useState, useContext, useCallback } from "react";
import AuthService from "../services/auth.service";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const login = useCallback(async (username, password) => {
    const data = await AuthService.login(username, password);
    setUser(data);
    return data;
  }, []);
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
