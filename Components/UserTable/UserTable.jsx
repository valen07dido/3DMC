"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./UserTable.module.css"; // Importa los estilos

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/getUsers", {
          withCredentials: true, // Para incluir las cookies en la petición
        });

        setUsers(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("No autorizado. Por favor, inicia sesión.");
        } else {
          setError("Error al cargar los usuarios. Inténtalo más tarde.");
        }
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className="text-xl font-bold mb-4">Lista de Usuarios</h1>
      {users.length > 0 ? (
        <table className={`${styles.table} min-w-full`}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Rol</th>
              <th className="py-2 px-4">Creado en</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="py-2 px-4">{user.id}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.rol}</td>
                <td className="py-2 px-4">
                  {new Date(user.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.loading}>Cargando usuarios...</p>
      )}
    </div>
  );
};

export default UsersTable;
