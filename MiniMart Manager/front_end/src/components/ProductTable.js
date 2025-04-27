import React, { useEffect, useContext, useState } from "react";
import Table from 'react-bootstrap/Table';  
import { ProductContext } from "../ProductContext";
import ProductRow from "./ProductRow";
import { useNavigate } from 'react-router-dom';
import { UpdateContext } from "../UpdateProductContext"; 
import { SupplierContext } from '../SupplierContext'

const ProductsTable = () => {
    const [products, setProducts, searchTerm] = useContext(ProductContext);
    const [updateProductInfo, setUpdateProductInfo] = useContext(UpdateContext);
    const [supplierDetail, setSupplierDetail] = useContext(SupplierContext);
    let navigate = useNavigate();

    const handleDelete = (id) => {
        fetch("http://127.0.0.1:8000/product/" + id, {
            method: "DELETE",
            headers: {
                accept: 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(result => {
            if (result.Status === 'ok') {
                const filteredProducts = products.data.filter(product => product.id !== id);
                setProducts({ data: [...filteredProducts] });
                alert("Product deleted");
            } else {
                alert("Product deletion failed");
            }
        });
    };

    const handleUpdate = (id) => {
        const product = products.data.filter(product => product.id === id)[0];
        setUpdateProductInfo({
            ProductName: product.name,
            QuantityInStock: product.quantity_in_Stock,
            QuantitySold: product.quantity_sold,
            UnitPrice: product.unit_price,
            Revenue: product.revenue,
            ProductId: id
        });
        navigate("/updateproduct");
    };

    const handleSupplier = (id) => {
        console.log("Fetching supplier with ID:", id);  // Log ID to verify
        fetch("http://localhost:8000/supplier/" + id, {
            headers: {
                Accept: 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(result => {
            console.log(result);  // Log result to verify the response
            if (result.Status === 'ok') {
                setSupplierDetail({ ...result.data });
                navigate("/supplierpage");
            } else {
                alert("Error fetching supplier data");
            }
        })
        .catch(err => {
            console.error("Error fetching supplier:", err);  // Catch any fetch errors
        });
    };
    
    

    useEffect(() => {
        fetch("http://127.0.0.1:8000/product")
            .then(resp => resp.json())
            .then(results => {
                setProducts({ data: [...results.data] });
            });
    }, []); 

    // 🧠 filter products based on searchTerm
    const filteredProducts = (products.data || []).filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Loading message while fetching products
    if (!products.data) {
        return <div>Loading products...</div>;
    }

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Product Name</th>
                        <th>Quantity In Stock</th>
                        <th>Quantity Sold</th>
                        <th>Unit Price</th>
                        <th>Revenue</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => (
                        <ProductRow
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            quantity_in_Stock={product.quantity_in_Stock}
                            quantity_sold={product.quantity_sold}
                            unit_price={product.unit_price}
                            revenue={product.revenue}
                            handleDelete={handleDelete}
                            handleUpdate={handleUpdate}
                            handleSupplier={handleSupplier}
                        />
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ProductsTable;
