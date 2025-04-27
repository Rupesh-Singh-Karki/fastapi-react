import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import { ProductProvider } from './ProductContext';
import ProductsTable from './components/ProductTable';
import AddProducts from './components/AddProducts';
import UpdateProduct from './components/UpdateProduct';
import { UpdateProductContextProvider } from './UpdateProductContext';
import { SupplierContextProvider } from './SupplierContext';  // Import the SupplierContextProvider
import SupplierPage from './components/SupplierPage';

function App() {
  return (
    <ProductProvider>
      <Router>
        <UpdateProductContextProvider>
          <SupplierContextProvider> {/* Wrap with SupplierContextProvider */}
            <NavBar />
            <div className="container">
              <div className="row">
                <div className="col-sm-10 col-12 mx-auto mt-4 mb-4">
                  <Routes>
                    <Route path="/" element={<ProductsTable />} />
                    <Route path="/addproduct" element={<AddProducts />} />
                    <Route path="/updateproduct" element={<UpdateProduct />} />
                    <Route path="/supplierpage" element={<SupplierPage />} />
                  </Routes>
                </div>
              </div>
            </div>
          </SupplierContextProvider> {/* Close SupplierContextProvider */}
        </UpdateProductContextProvider>
      </Router>
    </ProductProvider>
  );
}

export default App;
