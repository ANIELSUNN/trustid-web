import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';

import axios from 'axios';

export default function SignatureWorkspace() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [signature, setSignature] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/multisign/sign`, { token, signature });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.erreur || 'Erreur lors de la signature.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Signature du document</h2>
      <p>Signataire : <strong>{email}</strong></p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder="Écris ou colle ta signature ici..."
          rows={5}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit">Valider la signature</button>
      </form>
      {message && <p style={{ marginTop: '1rem', color: '#0F6E56' }}>{message}</p>}
    </div>
  );
}
