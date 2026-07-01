import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import jwtDecode from 'jwt-decode';

import axios from 'axios';

const colorOptions = [
  { label: 'Noir', value: 'noir', code: '#000000' },
  { label: 'Bleu', value: 'bleu', code: '#0F6E56' },
  { label: 'Violet', value: 'violet', code: '#7C3AED' },
  { label: 'Vert', value: 'vert', code: '#15803D' },
  { label: 'Rouge', value: 'rouge', code: '#B91C1C' }
];

export default function SignatureWorkspace() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [signature, setSignature] = useState('');
  const [couleur, setCouleur] = useState('noir');
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
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/multisign/sign`, { token, signature, couleur });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.erreur || err.response?.data?.error || 'Erreur lors de la signature.');
    }
  };

  const selectedColor = colorOptions.find((option) => option.value === couleur)?.code || '#000000';

  return (
    <div style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <h2>Signature du document</h2>
      <p>Signataire : <strong>{email}</strong></p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
        <label style={{ display: 'grid', gap: 10 }}>
          <span style={{ fontWeight: 600 }}>Couleur de signature</span>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCouleur(option.value)}
                style={{
                  minWidth: 80,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: couleur === option.value ? '2px solid #111827' : '1px solid #CBD5E1',
                  background: option.code,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </label>

        <label style={{ display: 'grid', gap: 10 }}>
          <span style={{ fontWeight: 600 }}>Votre signature</span>
          <textarea
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Écris ou colle ta signature ici..."
            rows={6}
            style={{ width: '100%', marginBottom: '1rem', borderRadius: 16, border: '1px solid #CBD5E1', padding: 16, fontSize: 15, color: selectedColor }}
          />
        </label>

        <button type="submit" style={{ background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 20px', cursor: 'pointer', fontWeight: 700 }}>
          Valider la signature
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem', color: '#0F6E56' }}>{message}</p>}
    </div>
  );
}
