import React, { useState, useEffect } from "react";
import "./index.css";

const API_URL = "https://fakestoreapi.com/products";

export const User = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateisModalOpen, setupdateIsModalOpen] = useState(false);
  const [updateProductTitle, setUpdateProductTitle] = useState("");
  const [updateProductDescription, setUpdateProductDescription] = useState("");
  const [updateproduct, setUpdateProduct] = useState({});
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);

      console.log("response", response);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleUpdateModal = () => {
    setupdateIsModalOpen(updateisModalOpen);
  };
  const handleUpdate = async () => {
    console.log("calle this");
    try {
      const response = await fetch(`${API_URL}/${updateproduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updateproduct.id,
          price: updateproduct.price,
          title: updateProductTitle,
          description: updateProductDescription,
          image: updateproduct.image,
        }),
      });

      if (response.ok) {
        handleUpdateModal();
        console.log(response.json(), "Product updated successfully");
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (product) => {
    try {
      const response = await fetch(`${API_URL}/${product.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(response.json(), "Product deleted successfully");
        fetchProducts();
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryFilter = (event) => {
    setCategoryFilter(event.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const titleMatch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch =
      categoryFilter === "" ||
      product.category.toLowerCase() === categoryFilter.toLowerCase();
    return titleMatch && categoryMatch;
  });

  return (
    <div className="app">
      <input
        type="text"
        placeholder="Search product"
        value={searchTerm}
        onChange={handleSearch}
      />
      <select value={categoryFilter} onChange={handleCategoryFilter}>
        <option value="">All</option>
        <option value="women's clothing">women's clothing</option>
        <option value="electronics">electronics </option>
        <option value="jewelery">jewelery </option>
      </select>
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Title</th>
            <th>Product Price</th>
            <th>Product Description</th>
            <th>Product Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>{product.category}</td>
              <td>
                <button
                  type="button"
                  class="btn btn-primary my-2"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleView(product)}
                >
                  View
                </button>
                <button
                  type="button"
                  class="btn btn-primary my-2"
                  data-bs-toggle="modal"
                  data-bs-target="#UpdateModal"
                  onClick={() => {
                    setUpdateProduct(product);
                    handleUpdateModal();
                  }}
                >
                  Update
                </button>
                <button
                  class="btn btn-secondary my-2"
                  onClick={() => handleDelete(product)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Product Details
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <p>Title: {selectedProduct.title}</p>
                <p>Price: {selectedProduct.price}</p>
                <p>Description: {selectedProduct.description}</p>
                <p>Category: {selectedProduct.category}</p>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!updateisModalOpen && (
        <div
          class="modal fade"
          id="UpdateModal"
          tabindex="-2"
          aria-labelledby="UpdateModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="UpdateModalLabel">
                  Product Update Details
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <input
                  placeholder="Enter Title"
                  type="text"
                  value={updateProductTitle}
                  onChange={(e) => setUpdateProductTitle(e.target.value)}
                ></input>
                <input
                  placeholder="Enter Description"
                  type="text"
                  value={updateProductDescription}
                  onChange={(e) => setUpdateProductDescription(e.target.value)}
                ></input>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    handleUpdate();
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
