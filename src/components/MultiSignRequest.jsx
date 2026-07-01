import React, { useState } from 'react';
import { uploadDocument } from '../services/api';

export default function MultiSignRequest({ user }) {
  const [file, setFile] = useState(null);
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const connectedEmail = user?.email?.trim().toLowerCase();
    const emailList = emails
      .split(/[\n,;]+/)
      .map(email => email.trim().toLowerCase())
      .filter(Boolean);
    const uniqueEmails = [...new Set(emailList)];
    const invitedEmails = connectedEmail
      ? uniqueEmails.filter(email => email !== connectedEmail)
      : uniqueEmails;

    if (!file || uniqueEmails.length === 0) {
      return setMessage('⚠️ Fichier et emails requis');
    }
    if (file.type !== 'application/pdf') {
      return setMessage('⚠️ Le document doit être un PDF');
    }
    if (uniqueEmails.some(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return setMessage('⚠️ Vérifiez les adresses email');
    }
    if (invitedEmails.length === 0) {
      return setMessage('⚠️ Ajoutez au moins un autre signataire que vous-même');
    }

    const formData = new FormData();
    formData.append('document', file, file.name); // doit correspondre à upload.single('document')
    formData.append('emails', invitedEmails.join(','));
    formData.append('signataires', JSON.stringify(invitedEmails));
    formData.append('title', file.name);
    formData.append('nomFichier', file.name);
    if (user?.id) {
      formData.append('userId', user.id);
      formData.append('createdBy', user.id);
    }
    if (user?.email) {
      formData.append('userEmail', user.email);
      formData.append('ownerEmail', user.email);
    }

    try {
      const res = await uploadDocument(formData);
      console.log('Upload success', res);
      setMessage(`✅ Upload réussi, docId: ${res.docId}`);
      setFile(null);
      setEmails('');
    } catch (err) {
      const data = err.response?.data;
      const detail = data?.details || data?.message || data?.erreur || data?.error || err.message;
      console.error('Upload error', data || err.message);
      setMessage(`❌ Erreur lors de l'upload: ${detail}`);
    }
  };

  return (
    <div style={{ maxWidth: 560, padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <label style={{ display: 'grid', gap: 8 }}>
          <span>Télécharger le document (PDF)</span>
          <input
            type="file"
            accept=".pdf" // ⚠️ limite aux PDF
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <label style={{ display: 'grid', gap: 8 }}>
          <span>Emails des signataires</span>
          <textarea
            rows={5}
            placeholder={'exemple1@email.com, exemple2@email.com\nou un email par ligne'}
            value={emails}
            onChange={e => setEmails(e.target.value)}
            style={{ padding: 10, resize: 'vertical' }}
          />
        </label>

        <button type="submit">Envoyer pour signature</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
