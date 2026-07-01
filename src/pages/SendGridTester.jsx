import React, { useState } from 'react';
import { api } from '../services/api';

export default function SendGridTester({ user }) {
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const handleTestSendGrid = async () => {
    if (!email.trim()) {
      setMessageType('error');
      return setMessage('⚠️ Veuillez entrer une adresse email.');
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/api/mailer/test-sendgrid', { email: email.trim() });
      setMessageType('success');
      setMessage(`✅ ${res.data.message}`);
      setEmail('');
    } catch (err) {
      const errorData = err.response?.data;
      const errorMsg = errorData?.details || errorData?.error || err.message;
      setMessageType('error');
      setMessage(`❌ Erreur : ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleTestSendGrid();
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 24, background: '#F8FAFC', borderRadius: 20, boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)' }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: 28, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <h2 style={{ margin: 0, fontSize: 30, color: '#0F172A' }}>🧪 Tester SendGrid</h2>
        <p style={{ margin: '12px 0 24px', color: '#475569', fontSize: 15 }}>
          Envoyez un email de test pour vérifier que votre configuration SendGrid est correcte.
        </p>

        <div style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 10 }}>
            <span style={{ fontWeight: 600, color: '#334155' }}>Adresse email de test</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="votre.email@exemple.com"
              disabled={loading}
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid #CBD5E1',
                fontSize: 15,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'text'
              }}
            />
          </label>

          <button
            onClick={handleTestSendGrid}
            disabled={loading}
            style={{
              background: loading ? '#94A3B8' : '#0F6E56',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              padding: '14px 20px',
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '⏳ Test en cours...' : '🧪 Envoyer email de test'}
          </button>
        </div>

        {message && (
          <div style={{
            marginTop: 24,
            padding: 18,
            borderRadius: 16,
            background: messageType === 'success' ? '#ECFDF5' : messageType === 'error' ? '#FEF2F2' : '#FEF3C7',
            border: messageType === 'success' ? '1px solid #A7F3D0' : messageType === 'error' ? '1px solid #FECACA' : '1px solid #FCD34D',
            color: messageType === 'success' ? '#064E3B' : messageType === 'error' ? '#7F1D1D' : '#92400E',
            fontSize: 14,
            lineHeight: 1.6
          }}>
            {message}
          </div>
        )}

        <div style={{
          marginTop: 28,
          padding: 16,
          borderRadius: 12,
          background: '#F0F9FF',
          border: '1px solid #BAE6FD'
        }}>
          <p style={{ margin: 0, color: '#0C4A6E', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            💡 Comment vérifier votre configuration SendGrid
          </p>
          <ul style={{ margin: 0, color: '#0C4A6E', fontSize: 13, paddingLeft: 20, lineHeight: 1.8 }}>
            <li><strong>SENDGRID_API_KEY</strong> doit être une clé API valide créée dans votre compte SendGrid</li>
            <li><strong>SENDGRID_FROM_EMAIL</strong> doit être une adresse email vérifiée dans SendGrid</li>
            <li>Si le test échoue, vérifiez vos variables d'environnement sur Railway</li>
            <li>Consultez la console SendGrid pour voir les logs d'envoi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
