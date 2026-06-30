import React, { useState } from 'react';
import { uploadDocument } from '../services/api';

export default function MultiSignRequest() {
  const [file, setFile] = useState(null);
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !emails) {
      return setMessage('⚠️ Fichier et emails requis');
    }

    const formData = new FormData();
    formData.append('document', file);
    formData.append('emails', emails);

    try {
      const res = await uploadDocument(formData);
      console.log('Upload success', res);
      setMessage(`✅ Upload réussi, docId: ${res.docId}`);
      setFile(null);
      setEmails('');
    } catch (err) {
      console.error('Upload error', err.response?.data || err.message);
      setMessage(`❌ Erreur lors de l'upload: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="emails séparés par ,"
          value={emails}
          onChange={e => setEmails(e.target.value)}
        />
        <button type="submit">Envoyer pour signature</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
