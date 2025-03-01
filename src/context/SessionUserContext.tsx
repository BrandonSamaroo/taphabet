import React, { createContext, useState } from 'react';

export const SessionUserContext = createContext<any>(null);

export const SessionUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionUser, setSessionUser] = useState(null);

  return (
    <SessionUserContext.Provider value={{ sessionUser, setSessionUser }}>
      {children}
    </SessionUserContext.Provider>
  );
};
