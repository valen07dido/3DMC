import React, { useState } from 'react';
import styles from './ContactForm.module.css'; // Importa los estilos

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('message', formData.message);
    if (formData.image) formDataToSend.append('image', formData.image);

    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formDataToSend
    });

    if (response.ok) {
      alert('Mensaje enviado con éxito');
    } else {
      alert('Hubo un error al enviar el mensaje');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Formulario de Contacto</h2>
      <input
        type="text"
        name="name"
        placeholder="Tu nombre"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Tu email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Mensaje"
        value={formData.message}
        onChange={handleChange}
        required
      />
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default ContactForm;
