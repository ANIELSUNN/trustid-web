import React, { useState } from 'react';
import { uploadAndSign } from '../services/api';

const colorOptions = [
  { label: 'Noir', value: 'noir', code: '#000000' },
  { label: 'Bleu', value: 'bleu', code: '#0F6E56' },
  { label: 'Violet', value: 'violet', code: '#7C3AED' },
  { label: 'Vert', value: 'vert', code: '#15803D' },
  { label: 'Rouge', value: 'rouge', code: '#B91C1C' }
];

export default function UploadAndSign({ user }) {
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState('');
  const [couleur, setCouleur] = useState('noir');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessageType('error');
      return setMessage('⚠️ Veuillez sélectionner un fichier.');
    }
    if (!signature.trim()) {
      setMessageType('error');
      return setMessage('⚠️ Veuillez ajouter une signature.');
    }

    const formData = new FormData();
    formData.append('document', file, file.name);
    formData.append('signature', signature.trim());
    formData.append('couleur', couleur);
    formData.append('email', user?.email || 'utilisateur@trustid.local');

    try {
      const res = await uploadAndSign(formData);
      setMessageType('success');
      setMessage(`✅ Document téléversé et signé avec succès. ID : ${res.docId}`);
      setFile(null);
      setSignature('');
      setCouleur('noir');
    } catch (err) {
      const data = err.response?.data;
      const detail = data?.details || data?.message || data?.erreur || data?.error || err.message;
      setMessageType('error');
      setMessage(`❌ Erreur : ${detail}`);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 24, background: '#F8FAFC', borderRadius: 20, boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)' }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: 28, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <h2 style={{ margin: 0, fontSize: 30, color: '#0F172A' }}>Téléverser et signer un document</h2>
        <p style={{ margin: '12px 0 24px', color: '#475569', fontSize: 15 }}>
          Choisissez n’importe quel fichier, ajoutez votre signature et enregistrez-le immédiatement.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 22 }}>
          <label style={{ display: 'grid', gap: 10 }}>
            <span style={{ fontWeight: 600, color: '#334155' }}>Document</span>
            <input
              type="file"
              accept="*/*"
              onChange={e => setFile(e.target.files?.[0] || null)}
              style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 15 }}
            />
            <span style={{ color: '#64748B', fontSize: 13 }}>
              Tous types de fichiers sont acceptés.
            </span>
            {file && (
              <div style={{ color: '#0F6E56', fontSize: 14 }}>
                Fichier sélectionné : <strong>{file.name}</strong>
              </div>
            )}
          </label>

          <label style={{ display: 'grid', gap: 10 }}>
            <span style={{ fontWeight: 600, color: '#334155' }}>Couleur de signature</span>
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
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </label>

          <label style={{ display: 'grid', gap: 10 }}>
            <span style={{ fontWeight: 600, color: '#334155' }}>Signature</span>
            <textarea
              rows={5}
              placeholder="Tapez votre signature ici..."
              value={signature}
              onChange={e => setSignature(e.target.value)}
              style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 15, resize: 'vertical', color: colorOptions.find((option) => option.value === couleur)?.code || '#000000' }}
            />
          </label>

          <button type="submit" style={{ background: '#0F6E56', color: '#FFFFFF', border: 'none', borderRadius: 12, padding: '14px 20px', fontSize: 15, cursor: 'pointer' }}>
            Téléverser et signer
          </button>
        </form>

        {message && (
          <div style={{ marginTop: 24, padding: 18, borderRadius: 16, background: messageType === 'success' ? '#ECFDF5' : '#FEF3C7', border: messageType === 'success' ? '1px solid #A7F3D0' : '1px solid #FCD34D', color: messageType === 'success' ? '#064E3B' : '#92400E' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
