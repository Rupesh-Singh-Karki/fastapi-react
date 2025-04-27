import React, { useContext, useState } from "react";
import { Navbar, Nav, Form, FormControl, Button, Badge, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ProductContext } from "../ProductContext";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts, searchTerm, setSearchTerm] = useContext(ProductContext);

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const filterProduct = (e) => {
    e.preventDefault();
    setSearchTerm(search);  // <- Update global searchTerm
  };

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Inventory Management App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          <Nav className="me-auto align-items-center">
            <Badge bg="primary" className="ms-2">
              Products In Stock {products.data.length}
            </Badge>
          </Nav>

          <Form onSubmit={filterProduct} className="d-flex align-items-center">
            <Link to="/addproduct" className="btn btn-primary btn-sm me-3">Add Product</Link>
            <FormControl
              value={search}
              onChange={updateSearch}
              type="text"
              placeholder="Search Products"
              className="me-2"
            />
            <Button type="submit" variant="outline-primary">
              Search
            </Button>
          </Form>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
