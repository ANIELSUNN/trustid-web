import React from 'react';

/**
 * SignersList
 * Affiche la liste des signataires d'un document avec leur statut.
 *
 * Props:
 *   signers[] — tableau de { email, name, status, signedAt?, invited? }
 */
export default function SignersList({ signers = [] }) {
  if (signers.length === 0) return null;

  return (
    <div style={card}>
      <h2 style={sectionTitle}>
        Signataires <span style={count}>({signers.length})</span>
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {signers.map((signer) => (
          <div key={signer.email} style={row}>
            {/* Avatar initiales */}
            <div style={avatar}>
              {(signer.name || signer.email).slice(0, 2).toUpperCase()}
            </div>

            {/* Infos */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={nameStyle}>{signer.name || signer.email}</p>
              <p style={emailStyle}>{signer.email}</p>
            </div>

            {/* Statut */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              <StatusBadge signer={signer} />
              {signer.signedAt && (
                <span style={dateStyle}>{signer.signedAt}</span>
              )}
              {signer.invited && signer.status !== 'signed' && (
                <span style={inviteNote}>📧 Email envoyé</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Badge de statut ────────────────────────────────────────────────────────────
function StatusBadge({ signer }) {
  const { status, invited } = signer;

  if (status === 'signed') {
    return <span style={{ ...badge, background: '#e6f4f1', color: '#00664f' }}>✓ Signé</span>;
  }
  if (status === 'refused') {
    return <span style={{ ...badge, background: '#fee8e8', color: '#c0392b' }}>✗ Refusé</span>;
  }
  if (invited) {
    return <span style={{ ...badge, background: '#edf2ff', color: '#2d4db5' }}>Invité</span>;
  }
  return <span style={{ ...badge, background: '#fff8e6', color: '#a0620c' }}>En attente</span>;
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const card = {
  background: '#ffffff',
  borderRadius: 12,
  border: '1px solid #d0ddd9',
  padding: '1.4rem 1.6rem',
  boxShadow: '0 2px 12px rgba(0,102,79,0.06)',
};

const sectionTitle = {
  margin: '0 0 1rem',
  fontSize: '1rem',
  fontWeight: 700,
  color: '#1a2e28',
};

const count = {
  fontWeight: 400,
  color: '#6b8c85',
};

const row = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '0.72rem',
  background: '#f8faf9',
  borderRadius: 10,
  border: '1px solid #d0ddd9',
};

const avatar = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: '#e6f4f1',
  color: '#00664f',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.84rem',
  flexShrink: 0,
  border: '1.5px solid #b3d9d2',
};

const nameStyle = {
  margin: 0,
  fontWeight: 600,
  fontSize: '0.92rem',
  color: '#1a2e28',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const emailStyle = {
  margin: 0,
  fontSize: '0.78rem',
  color: '#6b8c85',
};

const badge = {
  borderRadius: 20,
  padding: '3px 11px',
  fontSize: '0.76rem',
  fontWeight: 700,
  display: 'inline-block',
};

const dateStyle = {
  fontSize: '0.71rem',
  color: '#6b8c85',
};

const inviteNote = {
  fontSize: '0.71rem',
  color: '#e67e22',
};
