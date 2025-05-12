import React from "react";

const ProductRow = ({ id, name, quantity_in_Stock, quantity_sold, unit_price, revenue,
  handleDelete, handleUpdate, handleSupplier, supplier_id}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{quantity_in_Stock}</td>
      <td>{quantity_sold}</td>
      <td>{unit_price}</td>
      <td>{revenue}</td>
      <td>
        <button
          onClick={() => handleUpdate(id)}
          className="btn btn-outline-info btn-sm mx-1"
        >
          Update
        </button>
        <button
          onClick={() => handleSupplier(supplier_id)}
          className="btn btn-outline-success btn-sm mx-1"
        >
          Supplier
        </button>
        <button
          onClick={() => handleDelete(id)}
          className="btn btn-outline-danger btn-sm mx-1"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
