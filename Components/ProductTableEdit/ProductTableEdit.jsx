"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import axios from "axios"; // Asegúrate de importar axios
import styles from "./ProductTableEdit.module.css"; // Importar los estilos del módulo CSS

export default function ProductTableEdit() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetch("/api/getModel", { credentials: "include" }) // Incluir cookies en la solicitud
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Error: La API no devolvió un array válido", data);
          setProducts([]); // Evita errores asignando un array vacío
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]); // Si hay un error, evita que products sea undefined
      });
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = async (id) => {
    const productToUpdate = products.find((p) => p.id === id);

    if (!productToUpdate) {
      console.error("Producto no encontrado");
      return;
    }

    const updatedFields = {};
    if (editingProduct.name !== productToUpdate.name)
      updatedFields.name = editingProduct.name;
    if (editingProduct.description !== productToUpdate.description)
      updatedFields.description = editingProduct.description;
    if (editingProduct.image !== productToUpdate.image)
      updatedFields.image = editingProduct.image;
    if (editingProduct.categories !== productToUpdate.categories)
      updatedFields.categories = editingProduct.categories;
    if (editingProduct.solutions !== productToUpdate.solutions)
      updatedFields.solutions = editingProduct.solutions;
    if (editingProduct.characteristics !== productToUpdate.characteristics)
      updatedFields.characteristics = editingProduct.characteristics;
    if (editingProduct.carrousel !== productToUpdate.carrousel)
      updatedFields.carrousel = editingProduct.carrousel;
    if (editingProduct.price !== productToUpdate.price)
      updatedFields.price = editingProduct.price;

    if (Object.keys(updatedFields).length === 0) {
      console.log("No hay cambios para actualizar");
      return;
    }

    try {
      const response = await axios.put(`/api/addModel/${id}`, updatedFields, {
        withCredentials: true, // Enviar cookies con la solicitud
      });

      console.log("Producto actualizado correctamente:", response.data);

      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
      );

      setEditingProduct(null);
    } catch (error) {
      console.error(
        "Error al actualizar el producto:",
        error.response?.data || error
      );
    }
  };

  const handleChange = (id, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Productos</h2>
      {!Array.isArray(products) || products.length === 0 ? (
        <p className="text-center">No hay productos disponibles.</p>
      ) : (
        <div className="overflow-x-auto">
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
                        className={styles.input}
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
                  <td className="p-2">
                    {editingProduct?.id === product.id ? (
                      <input
                        type="number"
                        value={editingProduct.price}
                        className={styles.input}
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
                  <td className="p-2 flex gap-2">
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
      )}
    </div>
  );
}
