import React, { useState, useEffect } from 'react';
import { getHistorique } from '../services/api';

// Définition des styles en dehors du composant pour éviter les erreurs de référence
const s = {
  page: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  titre: { fontSize: '24px', marginBottom: '20px', color: '#333' },
  carte: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  item: { borderBottom: '1px solid #eee', padding: '15px 0', display: 'flex', flexDirection: 'column' },
  vide: { textAlign: 'center', color: '#888', padding: '20px' },
  erreur: { color: '#D8000C', fontWeight: 'bold' }
};

export default function Historique({ userId }) {
  const [signatures, setSignatures] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (userId) charger(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function charger(p = 1) {
    if (!userId) return setErreur('Utilisateur non connecté.');
    setChargement(true);
    setErreur('');
    try {
      const data = await getHistorique(userId, p);
      // Sécurisation : on force un tableau même si la réponse est mal formée
      const nouvellesSignatures = Array.isArray(data?.signatures) ? data.signatures : [];
      
      setSignatures(p === 1 ? nouvellesSignatures : [...signatures, ...nouvellesSignatures]);
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Erreur de chargement.');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div style={s.page}>
      <h1 style={s.titre}>Historique des signatures</h1>
      
      {/* Gestion de l'erreur */}
      {erreur && (
        <div style={{...s.carte, background: '#FCEBEB', marginBottom: '20px'}}>
          <p style={s.erreur}>{erreur}</p>
        </div>
      )}
      
      {/* Chargement */}
      {chargement && signatures.length === 0 ? (
        <div style={s.carte}><p style={s.vide}>Chargement en cours...</p></div>
      ) : (
        /* Rendu sécurisé : vérification stricte avec Array.isArray */
        (Array.isArray(signatures) && signatures.length > 0) ? (
          <div style={s.carte}>
            {signatures.map((sig, i) => (
              <div key={sig?._id || i} style={s.item}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{sig?.nomFichier || 'Document sans nom'}</p>
                <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
                  {sig?.createdAt ? new Date(sig.createdAt).toLocaleString('fr-FR') : 'Date inconnue'}
                </p>
                <span style={{ fontSize: '0.8em', color: '#007bff' }}>{sig?.statut || 'Statut inconnu'}</span>
              </div>
            ))}
          </div>
        ) : (
          !erreur && (
            <div style={s.carte}>
              <p style={s.vide}>📭 Aucune signature pour l'instant.</p>
            </div>
          )
        )
      )}
    </div>
  );
}