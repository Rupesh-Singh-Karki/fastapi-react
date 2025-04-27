import React, { createContext, useState } from 'react';

// Create a context for the supplier
export const SupplierContext = createContext();

export const SupplierContextProvider = ({ children }) => {
  const [supplierDetail, setSupplierDetail] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    emailTitle: '',
    email_msg: '',
    id: '' // Add ID to track the supplier
  });

  return (
    <SupplierContext.Provider value={[supplierDetail, setSupplierDetail]}>
      {children}
    </SupplierContext.Provider>
  );
};
