"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import axios from "axios";
import styles from "./ProductTableEdit.module.css";
import Swal from "sweetalert2";

export default function ProductTableEdit() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image: [],
    categories: "",
    type: "",
    characteristics: "",
    carrousel: "",
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
  
    const updatedFields = Object.fromEntries(
      Object.entries(editingProduct).filter(
        ([key, value]) => value !== productToUpdate[key]
      )
    );
  
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
  
      // Mostrar éxito con SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Producto actualizado con éxito',
        text: 'Los cambios del producto han sido guardados.',
      });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
  
      // Mostrar error con SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar el producto',
        text: 'Hubo un error al intentar actualizar el producto.',
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
        : [newProduct.characteristics],
      carrousel: newProduct.carrousel,
      price: newProduct.price,
    };
  
    try {
      const response = await axios.post("/api/addModel", data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
  
      // Recargar la lista de productos
      await fetchProducts();
  
      setShowPopup(false);
      setNewProduct({
        name: "",
        description: "",
        image: [],
        categories: "",
        type: "",
        characteristics: "",
        carrousel: "",
        price: "",
      });
  
      // Mostrar éxito con SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Producto creado con éxito',
        text: 'El nuevo producto ha sido agregado correctamente.',
      });
    } catch (error) {
      console.error("Error al crear el producto:", error);
  
      // Mostrar error con SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error al crear el producto',
        text: 'Hubo un error al intentar agregar el producto.',
      });
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
            {Object.keys(newProduct).map((key) =>
              key !== "image" ? (
                <input
                  key={key}
                  type={key === "price" ? "number" : "text"}
                  placeholder={key}
                  value={newProduct[key]}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, [key]: e.target.value })
                  }
                />
              ) : (
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
              )
            )}
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

      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Nombre</th>
            <th className={styles.th}>Precio</th>
            <th className={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border">
              <td className={styles.td}>{product.id}</td>
              <td className={styles.td}>
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    value={editingProduct?.name || ""}
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
                    type="number"
                    value={editingProduct?.price || ""}
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
                  <button
                    className={styles.saveButton}
                    onClick={() => handleSave(product.id)}
                  >
                    Guardar
                  </button>
                ) : (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil size={16} /> Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
