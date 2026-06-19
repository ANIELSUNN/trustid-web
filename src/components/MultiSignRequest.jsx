import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const GREEN = '#00664f';

export default function MultiSignRequest({ user }) {
  const [tab, setTab] = useState('creer');
  const [documentName, setDoc] = useState('');
  const [documentHash, setHash] = useState('');
  const [emails, setEmails] = useState(['']);
  const [file, setFile] = useState(null); // Nouveau state pour le fichier
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // ... (votre useEffect et fonctions email restent identiques)

  const handleSubmit = async () => {
    if (!file) return alert('Veuillez sélectionner un fichier.');
    
    // 1. Upload du fichier d'abord
    const formData = new FormData();
    formData.append('document', file);
    
    try {
      setLoading(true);
      const uploadRes = await api.post('/api/multisign/upload', formData);
      const fileName = uploadRes.data.fileName;

      // 2. Création de la demande avec le nom du fichier
      await api.post('/api/multisign/create', {
        documentName,
        documentHash,
        fileName, // On envoie le nom du fichier reçu du serveur
        requestedByEmail: user?.email,
        signatories: emails
      });
      
      setResult({ success: true, message: 'Demande créée avec succès !' });
    } catch (err) {
      setResult({ success: false, message: 'Erreur lors de l\'envoi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '32px auto', padding: 20 }}>
      {/* ... (votre code JSX) ... */}
      
      {/* AJOUTEZ CECI DANS VOTRE FORMULAIRE */}
      <div style={{ marginBottom: 20 }}>
        <label>Télécharger le document (PDF)</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Envoi...' : '📨 Envoyer'}
      </button>
    </div>
  );
}