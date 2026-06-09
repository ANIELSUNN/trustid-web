import React, { useState } from 'react';

/**
 * InviteModal
 * Modal pour inviter des signataires par email.
 * Un email avec le lien de signature leur sera envoyé.
 *
 * Props:
 *   onClose()              — ferme le modal
 *   onSend(emails[])       — appelé avec la liste des emails valides
 *   existingSigners[]      — liste des signataires déjà présents (pour éviter les doublons)
 */
export default function InviteModal({ onClose, onSend, existingSigners = [] }) {
  const [emails, setEmails] = useState(['']);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const addEmail = () => setEmails([...emails, '']);

  const updateEmail = (i, value) => {
    const updated = [...emails];
    updated[i] = value;
    setEmails(updated);
  };

  const removeEmail = (i) => setEmails(emails.filter((_, j) => j !== i));

  const handleSend = () => {
    const validEmails = emails.filter((e) => e.includes('@') && e.includes('.'));
    if (validEmails.length === 0) {
      setError('Veuillez saisir au moins une adresse email valide.');
      return;
    }

    const duplicates = validEmails.filter((e) =>
      existingSigners.some((s) => s.email === e)
    );
    if (duplicates.length > 0) {
      setError(`Ces adresses sont déjà signataires : ${duplicates.join(', ')}`);
      return;
    }

    setError('');
    setSent(true);

    // Simule un délai réseau avant de notifier le parent
    setTimeout(() => {
      onSend(validEmails);
      onClose();
    }, 1400);
  };

  // ── Styles inline (cohérents avec le reste de TrustID) ───────────────────────
  const s = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(10,30,25,0.48)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    },
    modal: {
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #d0ddd9',
      padding: '1.8rem',
      width: '100%',
      maxWidth: 480,
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 8px 40px rgba(0,102,79,0.15)',
    },
    label: {
      fontSize: '0.85rem',
      fontWeight: 600,
      color: '#6b8c85',
      marginBottom: 6,
      display: 'block',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    input: {
      flex: 1,
      padding: '0.72rem 1rem',
      border: '1px solid #d0ddd9',
      borderRadius: 9,
      fontSize: '0.93rem',
      background: '#f8faf9',
      outline: 'none',
      color: '#1a2e28',
      boxSizing: 'border-box',
    },
    btnPrimary: {
      background: '#00664f',
      color: '#fff',
      border: 'none',
      borderRadius: 9,
      padding: '0.65rem 1.3rem',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
    },
    btnOutline: {
      background: 'transparent',
      color: '#00664f',
      border: '1.5px solid #b3d9d2',
      borderRadius: 9,
      padding: '0.62rem 1.2rem',
      fontWeight: 600,
      fontSize: '0.92rem',
      cursor: 'pointer',
    },
    btnDanger: {
      background: '#fff0ef',
      color: '#c0392b',
      border: '1px solid #f5c6c2',
      borderRadius: 9,
      padding: '0.5rem 0.9rem',
      fontWeight: 600,
      fontSize: '0.86rem',
      cursor: 'pointer',
    },
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        {/* ── En-tête ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.4rem' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700 }}>
              Inviter des signataires
            </h3>
            <p style={{ margin: 0, color: '#6b8c85', fontSize: '0.84rem' }}>
              Chaque personne recevra un email avec le lien pour signer.
            </p>
          </div>
          <button style={s.btnDanger} onClick={onClose}>✕</button>
        </div>

        {/* ── État: envoyé ── */}
        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>✉️</div>
            <p style={{ fontWeight: 700, color: '#00664f', fontSize: '1.05rem', margin: '0 0 6px' }}>
              Invitations envoyées !
            </p>
            <p style={{ color: '#6b8c85', fontSize: '0.86rem', margin: 0 }}>
              Les signataires vont recevoir un email avec leur lien de signature personnalisé.
            </p>
          </div>
        ) : (
          <>
            {/* ── Liste d'emails ── */}
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={s.label}>Adresses email</label>
              {emails.map((email, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    style={s.input}
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(i, e.target.value)}
                    placeholder="signataire@exemple.com"
                    onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                  />
                  {emails.length > 1 && (
                    <button style={s.btnDanger} onClick={() => removeEmail(i)}>✕</button>
                  )}
                </div>
              ))}
              <button
                style={{ ...s.btnOutline, fontSize: '0.83rem', padding: '0.48rem 0.95rem', marginTop: 2 }}
                onClick={addEmail}
              >
                + Ajouter un email
              </button>
            </div>

            {/* ── Message personnalisé ── */}
            <div style={{ marginBottom: '1.4rem' }}>
              <label style={s.label}>Message (optionnel)</label>
              <textarea
                style={{ ...s.input, width: '100%', height: 80, resize: 'vertical', fontFamily: 'inherit' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Merci de signer ce document avant vendredi…"
              />
            </div>

            {/* ── Erreur ── */}
            {error && (
              <p style={{ color: '#c0392b', fontSize: '0.84rem', margin: '-0.6rem 0 0.9rem', fontWeight: 600 }}>
                ⚠ {error}
              </p>
            )}

            {/* ── Actions ── */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button style={s.btnOutline} onClick={onClose}>Annuler</button>
              <button style={s.btnPrimary} onClick={handleSend}>
                ✉ Envoyer les invitations
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
