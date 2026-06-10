// ============================================================
//  TrustID — pages/Historique.jsx
//  Historique des signatures — userId injecté depuis App.jsx
// ============================================================
import React, { useState, useEffect } from 'react';
import { getHistorique } from '../services/api';

export default function Historique({ userId }) {
  const [signatures, setSignatures] = useState([]);
  const [pagination, setPagination] = useState({});
  const [chargement, setChargement] = useState(false);
  const [erreur,     setErreur]     = useState('');
  const [page,       setPage]       = useState(1);

  // Charge automatiquement dès que userId est disponible
  useEffect(() => {
    if (userId) charger(1);
  }, [userId]);

  async function charger(p = 1) {
    if (!userId) return setErreur('Utilisateur non connecté.');
    setChargement(true);
    setErreur('');
    try {
      const data = await getHistorique(userId, p);
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
    page:    { maxWidth: 900, margin: '0 auto', padding: '40px 24px' },
    titre:   { fontSize: 28, fontWeight: 700, color: '#1C1C1E', marginBottom: 6 },
    sous:    { fontSize: 15, color: '#8E8E93', marginBottom: 32 },
    carte:   { background: 'white', borderRadius: 20, padding: 24, border: '0.5px solid #E5E5EA', marginBottom: 20 },
    erreur:  { color: '#E24B4A', fontSize: 13 },
    item:    { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '0.5px solid #F2F2F7' },
    icone:   { width: 40, height: 48, background: '#FAECE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
    nom:     { fontSize: 14, fontWeight: 500, color: '#1C1C1E' },
    date:    { fontSize: 12, color: '#8E8E93', marginTop: 2 },
    pille:   { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
    plusBtn: { width: '100%', background: '#F2F2F7', color: '#0F6E56', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, marginTop: 12, border: 'none', cursor: 'pointer' },
    vide:    { textAlign: 'center', color: '#8E8E93', padding: '40px 0', fontSize: 15 },
  };

  return (
    <div style={s.page}>
      <h1 style={s.titre}>Historique des signatures</h1>
      <p style={s.sous}>Toutes les signatures émises par votre compte TrustID</p>

      {erreur && (
        <div style={{ ...s.carte, background: '#FCEBEB' }}>
          <p style={s.erreur}>{erreur}</p>
        </div>
      )}

      {chargement && signatures.length === 0 && (
        <div style={s.carte}>
          <p style={s.vide}>Chargement...</p>
        </div>
      )}

      {!chargement && signatures.length === 0 && !erreur && (
        <div style={s.carte}>
          <p style={s.vide}>📭 Aucune signature pour l'instant.</p>
        </div>
      )}

      {signatures.length > 0 && (
        <div style={s.carte}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>
              Signatures ({pagination.total ?? signatures.length})
            </h3>
            <span style={{ fontSize: 13, color: '#8E8E93' }}>100% valides</span>
          </div>

          {signatures.map((sig, i) => (
            <div
              key={sig._id}
              style={{
                ...s.item,
                borderBottom: i < signatures.length - 1 ? '0.5px solid #F2F2F7' : 'none',
              }}
            >
              <div style={s.icone}>📄</div>
              <div style={{ flex: 1 }}>
                <p style={s.nom}>{sig.nomFichier || 'Document sans nom'}</p>
                <p style={s.date}>{new Date(sig.createdAt).toLocaleString('fr-FR')}</p>
              </div>
              <span
                style={{
                  ...s.pille,
                  background: sig.statut === 'valide' ? '#E1F5EE' : '#FCEBEB',
                  color:      sig.statut === 'valide' ? '#085041'  : '#E24B4A',
                }}
              >
                {sig.statut}
              </span>
            </div>
          ))}

          {page < (pagination.pages ?? 1) && (
            <button style={s.plusBtn} onClick={() => charger(page + 1)} disabled={chargement}>
              {chargement ? 'Chargement...' : 'Charger plus'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
