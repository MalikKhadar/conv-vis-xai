import React, { createContext, useContext, useState } from 'react';
import $ from 'jquery';

// Create a context for the logger
const LoggerContext = createContext();

export const LoggerProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [customData, setCustomData] = useState({});

  // Function to add a log
  const addLog = (description) => {
    let timestamp = new Date().toISOString();
    const newLog = `[${timestamp}]: ${description}`;
    setLogs(prevLogs => [...prevLogs, newLog]);
    console.log(newLog);
  };

  // Function to add custom data
  const addCustomData = (key, value) => {
    setCustomData(prevData => ({ ...prevData, [key]: value }));
  };

  // Function to upload logs
  const uploadLogs = () => {
    const data = { ...customData, logs: logs.join('\n') };
    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbweLsnfsFu-Q59DRQwoGUi3bz1BmoYXGcNaLOqmWYF6OErfcd3-VLFmLe-2LtS7-rZP/exec",
      type: "post",
      data: data,
    });
  };

  return (
    <LoggerContext.Provider value={{ logs, addLog, addCustomData, uploadLogs }}>
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

// Custom hook to add custom data
export const useAddCustomData = () => {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error('useAddCustomData must be used within a LoggerProvider');
  }
  return context.addCustomData;
};

// Custom hook to upload logs
export const useUploadLogs = () => {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error('useUploadLogs must be used within a LoggerProvider');
  }
  return context.uploadLogs;
};
