import { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState({ data: [] });
  const [searchTerm, setSearchTerm] = useState(""); // 🧠 added search term here

  return (
    <ProductContext.Provider value={[products, setProducts, searchTerm, setSearchTerm]}>
      {children}
    </ProductContext.Provider>
  );
};
