"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import axios from "axios";
import styles from "./ProductTableEdit.module.css";

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

  useEffect(() => {
    fetch("/api/getModel", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Error: La API no devolvió un array válido", data);
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      });
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

    if (Object.keys(updatedFields).length === 0) return;

    try {
      const response = await axios.put(`/api/addModel/${id}`, updatedFields, {
        withCredentials: true,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const response = await axios.post("/api/addModel", newProduct, {
        withCredentials: true,
      });
      setProducts([...products, response.data]);
      setShowPopup(false);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Productos</h2>
      <button className={styles.addButton} onClick={() => setShowPopup(true)}>
        <Plus size={16} /> Agregar Producto
      </button>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>Crear Nuevo Producto</h3>
            {Object.keys(newProduct).map((key) => (
              <input
                key={key}
                type={key === "price" ? "number" : "text"}
                placeholder={key}
                value={newProduct[key]}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, [key]: e.target.value })
                }
              />
            ))}
            <button onClick={handleCreateProduct}>Crear</button>
            <button onClick={() => setShowPopup(false)}>Cancelar</button>
          </div>
        </div>
      )}
      <table className="min-w-full border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border">
              <td className="p-2">{product.id}</td>
              <td className="p-2">
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                  />
                ) : (
                  product.name
                )}
              </td>
              <td className="p-2">
                {editingProduct?.id === product.id ? (
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: e.target.value })
                    }
                  />
                ) : (
                  `$${product.price}`
                )}
              </td>
              <td className="p-2 flex gap-2">
                {editingProduct?.id === product.id ? (
                  <button onClick={() => handleSave(product.id)}>Guardar</button>
                ) : (
                  <button onClick={() => handleEdit(product)}>
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
