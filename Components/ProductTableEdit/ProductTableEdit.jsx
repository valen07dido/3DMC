"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash } from "lucide-react";
import axios from "axios";
import styles from "./ProductTableEdit.module.css";
import Swal from "sweetalert2";

export default function ProductTableEdit() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image: [],
    categories: "",
    type: "",
    characteristics: "",
    carrousel: false,
    price: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/getModel?limit=999999", {
        credentials: "include",
      });
      const data = await res.json();
      if (data?.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("Error: La API no devolvió un array válido", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = async (id) => {
    const productToUpdate = products.find((p) => p.id === id);
    if (!productToUpdate) return;

    const updatedFields = {};

    // Actualizamos las propiedades editables.
    for (const [key, newValue] of Object.entries(editingProduct)) {
      if (key === "id" || key === "image") continue;

      let formattedValue = newValue;
      if (key === "characteristics" && typeof newValue === "string") {
        formattedValue = newValue.split(",").map((s) => s.trim());
      }
      if (key === "price") {
        formattedValue = Number(newValue);
      }

      if (
        JSON.stringify(formattedValue) !== JSON.stringify(productToUpdate[key])
      ) {
        updatedFields[key] = formattedValue;
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      setEditingProduct(null);
      return;
    }
    try {
      await axios.put(`/api/addModel/${id}`, updatedFields, {
        withCredentials: true,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
      );
      setEditingProduct(null);
      Swal.fire({
        icon: "success",
        title: "Producto actualizado con éxito",
        text: "Los cambios del producto han sido guardados.",
      });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar el producto",
        text: "Hubo un error al intentar actualizar el producto.",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/deleteModel/${id}`, {
        withCredentials: true,
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      Swal.fire({
        icon: "success",
        title: "Producto eliminado",
        text: "El producto ha sido eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error al eliminar el producto",
        text: "Hubo un error al intentar eliminar el producto.",
      });
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCreateProduct = async () => {
    const imagePromises = newProduct.image.map((file) => convertToBase64(file));
    const imagesBase64 = await Promise.all(imagePromises);

    const data = {
      name: newProduct.name,
      description: newProduct.description,
      images: imagesBase64,
      categories: newProduct.categories,
      type: newProduct.type,
      characteristics: Array.isArray(newProduct.characteristics)
        ? newProduct.characteristics
        : newProduct.characteristics.split(",").map((s) => s.trim()),
      carrousel: newProduct.carrousel,
      price: Number(newProduct.price),
    };

    try {
      await axios.post("/api/addModel", data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      await fetchProducts();
      setShowPopup(false);
      setNewProduct({
        name: "",
        description: "",
        image: [],
        categories: "",
        type: "",
        characteristics: "",
        carrousel: false,
        price: "",
      });
      Swal.fire({
        icon: "success",
        title: "Producto creado con éxito",
        text: "El nuevo producto ha sido agregado correctamente.",
      });
    } catch (error) {
      console.error("Error al crear el producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error al crear el producto",
        text: "Hubo un error al intentar agregar el producto.",
      });
    }
  };

  // Paginación
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className={styles.root}>
      <h2 className="text-2xl font-bold mb-4">Lista de Productos</h2>
      <button className={styles.addButton} onClick={() => setShowPopup(true)}>
        <Plus size={16} /> Agregar Producto
      </button>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>Crear Nuevo Producto</h3>
            {Object.keys(newProduct).map((key) => {
              if (key === "image") {
                return (
                  <input
                    key={key}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        image: Array.from(e.target.files),
                      })
                    }
                  />
                );
              } else if (key === "carrousel") {
                return (
                  <div key={key} className={styles.checkboxContainer}>
                    <label htmlFor={key}>Carrousel</label>
                    <input
                      type="checkbox"
                      id={key}
                      checked={newProduct.carrousel}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          carrousel: e.target.checked,
                        })
                      }
                    />
                  </div>
                );
              } else {
                return (
                  <input
                    key={key}
                    type={key === "price" ? "number" : "text"}
                    placeholder={key}
                    value={newProduct[key]}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, [key]: e.target.value })
                    }
                  />
                );
              }
            })}
            <div className={styles.divButtons}>
              <button
                className={styles.createButton}
                onClick={handleCreateProduct}
              >
                Crear
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowPopup(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Nombre</th>
              <th className={styles.th}>Descripción</th>
              <th className={styles.th}>Categorías</th>
              <th className={styles.th}>Tipo</th>
              <th className={styles.th}>Características</th>
              <th className={styles.th}>Carrousel</th>
              <th className={styles.th}>Precio</th>
              <th className={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="border">
                <td className={styles.td}>{product.id}</td>
                <td className={styles.td}>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.name || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className={styles.td}>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.description || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td className={styles.td}>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.categories || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          categories: e.target.value,
                        })
                      }
                    />
                  ) : (
                    product.categories
                  )}
                </td>
                <td className={styles.td}>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.type || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          type: e.target.value,
                        })
                      }
                    />
                  ) : (
                    product.type
                  )}
                </td>
                <td className={styles.td}>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="text"
                      value={
                        Array.isArray(editingProduct.characteristics)
                          ? editingProduct.characteristics.join(", ")
                          : editingProduct.characteristics || ""
                      }
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          characteristics: e.target.value,
                        })
                      }
                    />
                  ) : Array.isArray(product.characteristics) ? (
                    product.characteristics.join(", ")
                  ) : (
                    product.characteristics
                  )}
                </td>
                <td className={styles.td}>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="checkbox"
                      checked={editingProduct.carrousel}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          carrousel: e.target.checked,
                        })
                      }
                    />
                  ) : product.carrousel ? (
                    "Sí"
                  ) : (
                    "No"
                  )}
                </td>
                <td className={styles.td}>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="number"
                      value={editingProduct.price || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: e.target.value,
                        })
                      }
                    />
                  ) : (
                    `$${product.price}`
                  )}
                </td>
                <td className={styles.td}>
                  {editingProduct?.id === product.id ? (
                    <>
                      <button
                        className={styles.saveButton}
                        onClick={() => handleSave(product.id)}
                      >
                        Guardar
                      </button>
                      <button
                        className={styles.saveButton}
                        onClick={() => setEditingProduct(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil size={16} /> Editar
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash size={16} /> Borrar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
