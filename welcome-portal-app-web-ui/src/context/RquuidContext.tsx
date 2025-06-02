'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface RquuidContextType {
  rquuid: string;
}

const RquuidContext = createContext<RquuidContextType | undefined>(undefined);

export const useRquuid = () => {
  const context = useContext(RquuidContext);
  if (!context) {
    throw new Error('useRquuid must be used within a RquuidProvider');
  }
  return context;
};

export const RquuidProvider = ({ children }: { children: React.ReactNode }) => {
  const [rquuid, setRquuid] = useState('');

  useEffect(() => {
    let storedUuid = localStorage.getItem('rquuid');
    if (!storedUuid) {
      storedUuid = uuidv4();
      localStorage.setItem('rquuid', storedUuid);
    }
    setRquuid(storedUuid);
  }, []);

  const contextValue = useMemo(() => ({ rquuid }), [rquuid]);

  if (!rquuid) return null;

  return (
    <RquuidContext.Provider value={contextValue}>
      {children}
    </RquuidContext.Provider>
  );
};
