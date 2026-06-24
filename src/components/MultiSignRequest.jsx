// src/components/MultiSignRequest.jsx
import React, { useState } from 'react';
import { uploadDocument } from '../services/api';

export default function MultiSignRequest() {
  const [file, setFile] = useState(null);
  const [emails, setEmails] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !emails) return alert('Fichier et emails requis');

    const formData = new FormData();
    formData.append('document', file);
    formData.append('emails', emails);

    try {
      const res = await uploadDocument(formData);
      console.log('Upload success', res);
      alert('Upload réussi');
    } catch (err) {
      console.error('Upload error', err.response?.data || err.message);
      alert('Erreur lors de l\'upload');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <input type="text" placeholder="emails séparés par ," value={emails} onChange={e => setEmails(e.target.value)} />
      <button type="submit">Envoyer pour signature</button>
    </form>
  );
}
