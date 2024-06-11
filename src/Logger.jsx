import React, { createContext, useContext, useState } from 'react';

// Create a context for the logger
const LoggerContext = createContext();

export const LoggerProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  // Function to add a log
  const addLog = (description) => {
    let timestamp = new Date().toISOString();
    const newLog = `[${timestamp}]: ${description}`;
    setLogs(prevLogs => [...prevLogs, newLog]);
    console.log(newLog);
  };

  return (
    <LoggerContext.Provider value={{ logs, addLog }}>
      {children}
    </LoggerContext.Provider>
  );
};

// Custom hook to use the logger
export const useLogger = () => useContext(LoggerContext);

// Custom hook to add a log
export const useAddLog = () => {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error('useAddLog must be used within a LoggerProvider');
  }
  return context.addLog;
};