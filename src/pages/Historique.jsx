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
    <div style={{ padding: '20px' }}>
      <h1>Historique des signatures</h1>
      
      {erreur && <div style={{ background: '#FCEBEB', padding: '10px', marginBottom: '10px' }}>{erreur}</div>}
      
      {chargement && signatures.length === 0 ? (
        <div>Chargement en cours...</div>
      ) : (
        Array.isArray(signatures) && signatures.length > 0 ? (
          <div>
            <h3>Signatures ({pagination?.total ?? signatures.length})</h3>
            {signatures.map((sig, i) => (
              <div key={sig._id || i} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <p>{sig.nomFichier || 'Document sans nom'}</p>
                <p>{sig.createdAt ? new Date(sig.createdAt).toLocaleDateString() : 'Date inconnue'}</p>
              </div>
            ))}
            {page < (pagination?.pages ?? 1) && (
              <button onClick={() => charger(page + 1)} disabled={chargement}>
                {chargement ? 'Chargement...' : 'Charger plus'}
              </button>
            )}
          </div>
        ) : (
          !erreur && <div>📭 Aucune signature pour l'instant.</div>
        )
      )}
    </div>
  );
}