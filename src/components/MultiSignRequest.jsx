import React, { useState } from 'react';
import { uploadDocument } from '../services/api';

export default function MultiSignRequest({ user }) {
  const [file, setFile] = useState(null);
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [summary, setSummary] = useState(null);

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
      setMessageType('error');
      return setMessage('⚠️ Fichier et emails requis');
    }
    if (file.type !== 'application/pdf') {
      setMessageType('error');
      return setMessage('⚠️ Le document doit être un PDF');
    }
    if (uniqueEmails.some(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      setMessageType('error');
      return setMessage('⚠️ Vérifiez les adresses email');
    }
    if (invitedEmails.length === 0) {
      setMessageType('error');
      return setMessage('⚠️ Ajoutez au moins un autre signataire que vous-même');
    }

    const formData = new FormData();
    formData.append('document', file, file.name);
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
      setMessageType('success');
      setMessage('✅ Demande envoyée avec succès. Les signataires vont recevoir le lien de signature.');
      setSummary({
        docId: res.docId,
        count: invitedEmails.length,
        recipients: invitedEmails,
        fileName: file.name,
      });
      setFile(null);
      setEmails('');
    } catch (err) {
      const data = err.response?.data;
      const detail = data?.details || data?.message || data?.erreur || data?.error || err.message;
      console.error('Upload error', data || err.message);
      setMessageType('error');
      setMessage(`❌ Erreur lors de l'envoi : ${detail}`);
      setSummary(null);
    }
  };

  const containerStyle = {
    maxWidth: 640,
    margin: '0 auto',
    padding: 24,
    background: '#F8FAFC',
    borderRadius: 18,
    boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
  };
  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    border: '1px solid rgba(15, 23, 42, 0.08)',
  };
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1px solid #CBD5E1',
    outline: 'none',
    fontSize: 15,
  };
  const buttonPrimary = {
    background: '#0F6E56',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 12,
    padding: '14px 20px',
    fontSize: 15,
    cursor: 'pointer',
    transition: 'transform 0.18s ease, background 0.18s ease',
  };
  const buttonSecondary = {
    background: '#E2E8F0',
    color: '#0F172A',
    border: 'none',
    borderRadius: 12,
    padding: '12px 18px',
    fontSize: 14,
    cursor: 'pointer',
  };
  const statusStyle = {
    padding: '16px 18px',
    borderRadius: 14,
    background: messageType === 'success' ? '#ECFDF5' : '#FEF3C7',
    border: messageType === 'success' ? '1px solid #A7F3D0' : '1px solid #FCD34D',
    color: messageType === 'success' ? '#064E3B' : '#92400E',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: '#0F172A' }}>Envoyer un document à signer</h2>
          <p style={{ margin: '12px 0 0', color: '#475569', fontSize: 15 }}>
            Choisissez un PDF et ajoutez les adresses email des signataires. Le lien sera envoyé automatiquement.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          <label style={{ display: 'grid', gap: 10 }}>
            <span style={{ fontWeight: 600, color: '#334155' }}>Document PDF</span>
            <input
              type="file"
              accept=".pdf"
              onChange={e => setFile(e.target.files?.[0] || null)}
              style={inputStyle}
            />
            {file && (
              <div style={{ color: '#0F6E56', fontSize: 14 }}>
                Fichier sélectionné : <strong>{file.name}</strong>
              </div>
            )}
          </label>

          <label style={{ display: 'grid', gap: 10 }}>
            <span style={{ fontWeight: 600, color: '#334155' }}>Emails des signataires</span>
            <textarea
              rows={5}
              placeholder="exemple1@email.com, exemple2@email.com ou un email par ligne"
              value={emails}
              onChange={e => setEmails(e.target.value)}
              style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }}
            />
            <span style={{ color: '#64748B', fontSize: 13 }}>
              Séparez les emails par virgule, point-virgule ou saut de ligne.
            </span>
          </label>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="submit" style={buttonPrimary} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
              Envoyer pour signature
            </button>
            <button
              type="button"
              style={buttonSecondary}
              onClick={() => {
                setFile(null);
                setEmails('');
                setMessage('');
                setSummary(null);
                setMessageType('info');
              }}
            >
              Réinitialiser
            </button>
          </div>
        </form>

        {message && (
          <div style={{ marginTop: 24, ...statusStyle }}>
            {message}
          </div>
        )}

        {summary && (
          <div style={{ marginTop: 24, padding: 20, borderRadius: 16, background: '#F1F5F9', border: '1px solid #CBD5E1' }}>
            <h3 style={{ margin: 0, fontSize: 18, color: '#0F172A' }}>Bilan de l'opération</h3>
            <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>Document</span>
                <strong>{summary.fileName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>Nombre de destinataires</span>
                <strong>{summary.count}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>ID du document</span>
                <strong>{summary.docId}</strong>
              </div>
              <div>
                <span style={{ color: '#334155', fontWeight: 600 }}>Emails envoyés :</span>
                <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: '#475569' }}>
                  {summary.recipients.map(email => (
                    <li key={email}>{email}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
