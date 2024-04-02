// FormDataContext.js

import React, { createContext, useContext, useState } from "react";

const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    societe: "",
    tel: "",
    gsm: "",
    dateRdv: null,
    agent: "",
    agenda: ""
  });

  const updateFormData = (newData) => {
    setFormData({ ...formData, ...newData });
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => useContext(FormDataContext);
