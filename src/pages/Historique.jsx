import React, { useState, useEffect } from 'react';
import { getHistorique } from '../services/api';

export default function Historique({ userId }) {
  const [signatures, setSignatures] = useState([]);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (userId) charger(1);
  }, [userId]);

  async function charger(p = 1) {
    if (!userId) return setErreur('Utilisateur non connecté.');
    setChargement(true);
    setErreur('');
    try {
      const data = await getHistorique(userId, p);
      // On s'assure que data.signatures est bien un tableau
      const nouvellesSignatures = Array.isArray(data?.signatures) ? data.signatures : [];
      
      setSignatures(p === 1 ? nouvellesSignatures : [...signatures, ...nouvellesSignatures]);
      setPagination(data?.pagination || { pages: 1, total: 0 });
      setPage(p);
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Erreur de chargement.');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div style={s.page}>
      <h1 style={s.titre}>Historique des signatures</h1>
      
      {erreur && <div style={{...s.carte, background: '#FCEBEB'}}><p style={s.erreur}>{erreur}</p></div>}
      
      {chargement && signatures.length === 0 ? (
        <div style={s.carte}><p style={s.vide}>Chargement en cours...</p></div>
      ) : (
        Array.isArray(signatures) && signatures.length > 0 ? (
          <div style={s.carte}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16 }}>Signatures ({pagination?.total ?? signatures.length})</h3>
            </div>

            {/* RENDU SÉCURISÉ : On vérifie chaque sig avant d'afficher */}
            {signatures.map((sig, i) => (
              sig ? (
                <div key={sig._id || i} style={s.item}>
                  <p>{sig.nomFichier || 'Document sans nom'}</p>
                  <p>{sig.createdAt ? new Date(sig.createdAt).toLocaleDateString() : 'Date inconnue'}</p>
                  <span>{sig.statut || 'N/A'}</span>
                </div>
              ) : null
            ))}

            {page < (pagination?.pages ?? 1) && (
              <button onClick={() => charger(page + 1)} disabled={chargement}>
                {chargement ? 'Chargement...' : 'Charger plus'}
              </button>
            )}
          </div>
        ) : (
          !erreur && <div style={s.carte}><p style={s.vide}>📭 Aucune signature pour l'instant.</p></div>
        )
      )}
    </div>
  );
}

// Assurez-vous que votre objet 's' est défini ci-dessous ou importé
const s = {
  page: { padding: '20px' },
  titre: { fontSize: '24px', marginBottom: '20px' },
  carte: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  item: { borderBottom: '1px solid #eee', padding: '10px 0' },
  vide: { textAlign: 'center', color: '#888' },