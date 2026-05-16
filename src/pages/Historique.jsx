// ============================================================
//  TrustID — pages/Historique.jsx
// ============================================================

import React, { useState } from 'react';
import { getHistorique }   from '../services/api';

export default function Historique() {
  const [userId,     setUserId]     = useState('');
  const [signatures, setSignatures] = useState([]);
  const [pagination, setPagination] = useState({});
  const [chargement, setChargement] = useState(false);
  const [erreur,     setErreur]     = useState('');
  const [page,       setPage]       = useState(1);

  async function charger(p = 1) {
    if (!userId.trim()) return setErreur('Entrez un ID utilisateur.');
    setChargement(true); setErreur('');

    try {
      const data = await getHistorique(userId.trim(), p);
      setSignatures(p === 1 ? data.signatures : [...signatures, ...data.signatures]);
      setPagination(data.pagination);
      setPage(p);
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Erreur de chargement.');
    } finally {
      setChargement(false);
    }
  }

  const s = {
    page:   { maxWidth: 900, margin: '0 auto', padding: '40px 24px' },
    titre:  { fontSize: 28, fontWeight: 700, color: '#1C1C1E', marginBottom: 6 },
    sous:   { fontSize: 15, color: '#8E8E93', marginBottom: 32 },
    carte:  { background: 'white', borderRadius: 20, padding: 24, border: '0.5px solid #E5E5EA', marginBottom: 20 },
    row:    { display: 'flex', gap: 10, marginBottom: 16 },
    input:  { flex: 1, background: '#F2F2F7', border: '0.5px solid #E5E5EA', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#1C1C1E' },
    btn:    { background: '#0F6E56', color: 'white', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 600 },
    erreur: { color: '#E24B4A', fontSize: 13 },
    item:   { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '0.5px solid #F2F2F7' },
    icone:  { width: 40, height: 48, background: '#FAECE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
    nom:    { fontSize: 14, fontWeight: 500, color: '#1C1C1E' },
    date:   { fontSize: 12, color: '#8E8E93', marginTop: 2 },
    pille:  { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
    plusBtn:{ width: '100%', background: '#F2F2F7', color: '#0F6E56', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, marginTop: 12 },
  };

  return (
    <div style={s.page}>
      <h1 style={s.titre}>Historique des signatures</h1>
      <p style={s.sous}>Consultez toutes les signatures émises par un utilisateur TrustID</p>

      <div style={s.carte}>
        <div style={s.row}>
          <input
            style={s.input}
            placeholder="ID utilisateur MongoDB"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && charger(1)}
          />
          <button style={s.btn} onClick={() => charger(1)} disabled={chargement}>
            {chargement ? '...' : 'Charger'}
          </button>
        </div>
        {erreur && <p style={s.erreur}>{erreur}</p>}
      </div>

      {signatures.length > 0 && (
        <div style={s.carte}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Signatures ({pagination.total})</h3>
            <span style={{ fontSize: 13, color: '#8E8E93' }}>100% valides</span>
          </div>

          {signatures.map((sig, i) => (
            <div key={sig._id} style={{ ...s.item, borderBottom: i < signatures.length - 1 ? '0.5px solid #F2F2F7' : 'none' }}>
              <div style={s.icone}>📄</div>
              <div style={{ flex: 1 }}>
                <p style={s.nom}>{sig.nomFichier}</p>
                <p style={s.date}>{new Date(sig.createdAt).toLocaleString('fr-FR')}</p>
              </div>
              <span style={{ ...s.pille, background: sig.statut === 'valide' ? '#E1F5EE' : '#FCEBEB', color: sig.statut === 'valide' ? '#085041' : '#E24B4A' }}>
                {sig.statut}
              </span>
            </div>
          ))}

          {page < pagination.pages && (
            <button style={s.plusBtn} onClick={() => charger(page + 1)}>
              Charger plus
            </button>
          )}
        </div>
      )}
    </div>
  );
}
