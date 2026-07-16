import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import SignatureCanvas from 'react-signature-canvas';

import axios from 'axios';
import TrustIDLogo from '../components/TrustIDLogo';

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

  const succes = message.startsWith('✅') || (message && !message.startsWith('⚠️') && !message.startsWith('❌'));

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f5', fontFamily: "'Instrument Sans', 'Segoe UI', system-ui, sans-serif", padding: '32px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <TrustIDLogo size={34} />
          </Link>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 20, padding: 32, boxShadow: '0 10px 30px rgba(0, 102, 79, 0.10)', border: '1px solid #d0ddd9' }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1a2e28' }}>Signature du document</h1>
          <p style={{ margin: '8px 0 28px', color: '#6b8c85', fontSize: 15 }}>
            Signataire : <strong style={{ color: '#00664f' }}>{email || '—'}</strong>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 22 }}>
            <label style={{ display: 'grid', gap: 10 }}>
              <span style={{ fontWeight: 700, color: '#1a2e28', fontSize: 14 }}>Couleur de signature</span>
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
                      border: couleur === option.value ? '2px solid #00664f' : '1px solid #d0ddd9',
                      background: option.code,
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      fontWeight: 600,
                      boxShadow: couleur === option.value ? '0 0 0 3px #e6f4f1' : 'none',
                      transition: 'box-shadow 0.15s',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </label>

            <label style={{ display: 'grid', gap: 10 }}>
              <span style={{ fontWeight: 700, color: '#1a2e28', fontSize: 14 }}>Votre signature</span>
              <div style={{ border: '2px dashed #b3d9d2', borderRadius: 14, overflow: 'hidden', background: '#f8faf9' }}>
                <SignatureCanvas
                  ref={signatureCanvasRef}
                  canvasProps={{
                    width: 620,
                    height: 180,
                    style: { display: 'block', width: '100%', height: 180, cursor: 'crosshair', background: '#f8faf9' }
                  }}
                  penColor={colorOptions.find((option) => option.value === couleur)?.code || '#000000'}
                  dotSize={3}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => signatureCanvasRef.current?.clear()}
                  style={{ background: 'transparent', color: '#00664f', border: '1.5px solid #b3d9d2', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                >
                  ✕ Effacer
                </button>
                <span style={{ color: '#6b8c85', fontSize: 13 }}>
                  ✏️ Dessinez votre signature à la main
                </span>
              </div>
            </label>

            <button
              type="submit"
              style={{ background: '#00664f', color: '#fff', border: 'none', borderRadius: 12, padding: '15px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}
            >
              Valider la signature
            </button>
          </form>

          {message && (
            <div
              style={{
                marginTop: 20,
                padding: '14px 16px',
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.5,
                background: succes ? '#e6f4f1' : '#fceceb',
                color: succes ? '#00664f' : '#c0392b',
                border: `1px solid ${succes ? '#b3d9d2' : '#f3c6c2'}`,
              }}
            >
              {message}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#6b8c85', fontSize: 12, marginTop: 20 }}>
          TrustID — Identité Numérique Souveraine
        </p>
      </div>
    </div>
  );
}
