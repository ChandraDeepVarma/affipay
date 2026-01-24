// src/context/UserStatusContext.jsx
"use client";
import { createContext, useContext, useState } from "react";

const UserStatusContext = createContext();

export const UserStatusProvider = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(0);

  const triggerRefresh = () => setRefreshFlag(prev => prev + 1);

  return (
    <UserStatusContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </UserStatusContext.Provider>
  );
};

export const useUserStatus = () => useContext(UserStatusContext);
