"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import axios from "axios";
import Swal from "sweetalert2";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [editableProfile, setEditableProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const id = usePathname().split("/").pop();
  // Obtiene los datos del perfil al montar el componente
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`/api/getUsers/${id}`, {
          withCredentials: true,
        });
        // Se asume que la API retorna { profile: { ...datos del usuario } }
        console.log(res.data)
        setProfile(res.data);
        setEditableProfile(res.data);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar el perfil",
        });
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Para la actualización, se envían solo los datos editables. Los campos "id" y "created_at" permanecen sin cambios.
      const { id, created_at, ...dataToUpdate } = editableProfile;
      const res = await axios.put("/api/getUsers/", dataToUpdate, {
        withCredentials: true,
      });
      setProfile(res.data);
      setEditableProfile(res.data);
      setEditing(false);
      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Los cambios han sido guardados correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el perfil",
      });
    }
  };

  const handleCancel = () => {
    // Reestablecemos los valores editados a los del perfil original y salimos del modo edición
    setEditableProfile(profile);
    setEditing(false);
  };

  if (!profile) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Mi Perfil</h1>
      <form
        className="profile-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* Campo ID: no editable */}
        <div className="form-group">
          <label>ID:</label>
          <input type="text" name="id" value={profile.id} disabled />
        </div>

        {/* Campo Email: se puede editar */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={editableProfile.email || ""}
            onChange={editing ? handleChange : undefined}
            disabled={!editing}
          />
        </div>

        {/* Campo Password: Se muestra enmascarado */}
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value="********" disabled />
        </div>

        {/* Campo Name */}
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={editableProfile.name || ""}
            onChange={editing ? handleChange : undefined}
            disabled={!editing}
          />
        </div>

        {/* Campo Username */}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={editableProfile.username || ""}
            onChange={editing ? handleChange : undefined}
            disabled={!editing}
          />
        </div>

        {/* Campo Rol: info de solo lectura */}
        <div className="form-group">
          <label>Rol:</label>
          <input type="text" name="rol" value={profile.rol} disabled />
        </div>

        {/* Campo Fecha de Creación */}
        <div className="form-group">
          <label>Creado el:</label>
          <input
            type="text"
            name="created_at"
            value={new Date(profile.created_at).toLocaleString()}
            disabled
          />
        </div>

        {/* Acciones: Editar, Guardar y Cancelar */}
        <div className="form-actions">
          {editing ? (
            <>
              <button type="submit" className="saveButton">
                Guardar
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="cancelButton"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="editButton"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </form>

      {/* Estilos locales utilizando JSX style */}
      <style jsx>{`
        .profile-container {
          max-width: 500px;
          margin: 78px auto;
          padding: 1rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          color: #333;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .form-group input {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        .editButton,
        .saveButton,
        .cancelButton {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }
        .editButton {
          background: #007bff;
          color: #fff;
        }
        .saveButton {
          background: #4caf50;
          color: #fff;
        }
        .cancelButton {
          background: #f44336;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
