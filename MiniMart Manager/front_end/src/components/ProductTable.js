import React, { useEffect, useContext } from "react";
import Table from 'react-bootstrap/Table';  
import { ProductContext } from "../ProductContext";
import ProductRow from "./ProductRow";
import { useNavigate } from 'react-router-dom';
import { UpdateContext } from "../UpdateProductContext"; 
import { SupplierContext } from '../SupplierContext';

const ProductsTable = () => {
    const [products, setProducts, searchTerm] = useContext(ProductContext);
    const [updateProductInfo, setUpdateProductInfo] = useContext(UpdateContext);
    const [supplierDetail, setSupplierDetail] = useContext(SupplierContext);
    const navigate = useNavigate();

    const handleDelete = (id) => {
        fetch(`http://127.0.0.1:8000/product/${id}`, {
            method: "DELETE",
            headers: { accept: 'application/json' }
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
        const product = products.data.find(p => p.id === id);
        setUpdateProductInfo({
            ProductName: product.name,
            QuantityInStock: product.quantity_in_Stock,
            QuantitySold: product.quantity_sold,
            UnitPrice: product.unit_price,
            Revenue: product.revenue,
            ProductId: product.id,
            Supplier: product.supplied_by_id  // 🧠 this line is essential
        });
        navigate("/updateproduct");
    };

    const handleSupplier = (supplierId) => {
        if (!supplierId) {
            alert("No supplier linked to this product.");
            return;
        }

        fetch(`http://localhost:8000/supplier/${supplierId}`, {
            headers: { Accept: 'application/json' }
        })
        .then(resp => resp.json())
        .then(result => {
            if (result.Status === 'ok') {
                setSupplierDetail({ ...result.data });
                navigate("/supplierpage");
            } else {
                alert("Error fetching supplier data");
            }
        })
        .catch(err => {
            console.error("Error fetching supplier:", err);
            alert("Fetch error: " + err.message);
        });
    };

    useEffect(() => {
        fetch("http://127.0.0.1:8000/product")
            .then(resp => resp.json())
            .then(results => {
                setProducts({ data: [...results.data] });
            });
    }, []); 

    if (!products.data) {
        return <div>Loading products...</div>;
    }

    const filteredProducts = products.data.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            supplier_id={product.supplied_by_id}
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
