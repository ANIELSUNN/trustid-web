import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import SignatureCanvas from 'react-signature-canvas';

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
  const [couleur, setCouleur] = useState('noir');
  const [message, setMessage] = useState('');
  const signatureCanvasRef = useRef(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const signatureImage = signatureCanvasRef.current?.toDataURL() || '';
      if (!signatureImage || signatureImage === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==') {
        setMessage('⚠️ Veuillez signer dans la zone de dessin.');
        return;
      }
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/multisign/sign`, { token, signature: signatureImage, couleur });
      setMessage(res.data.message);
      signatureCanvasRef.current?.clear();
    } catch (err) {
      setMessage(err.response?.data?.erreur || err.response?.data?.error || 'Erreur lors de la signature.');
    }
  };

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
          <div style={{ border: '2px solid #CBD5E1', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            <SignatureCanvas
              ref={signatureCanvasRef}
              canvasProps={{
                width: 620,
                height: 180,
                style: { display: 'block', cursor: 'crosshair', background: '#FFFFFF' }
              }}
              penColor={colorOptions.find((option) => option.value === couleur)?.code || '#000000'}
              dotSize={3}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => signatureCanvasRef.current?.clear()}
              style={{ background: '#E2E8F0', color: '#334155', border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontWeight: 600, flex: 1 }}
            >
              Effacer
            </button>
            <span style={{ color: '#64748B', fontSize: 13, alignSelf: 'center' }}>
              Dessinez votre signature
            </span>
          </div>
        </label>

        <button type="submit" style={{ background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 20px', cursor: 'pointer', fontWeight: 700 }}>
          Valider la signature
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem', color: '#0F6E56' }}>{message}</p>}
    </div>
  );
}
