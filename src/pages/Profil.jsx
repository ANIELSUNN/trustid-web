// ============================================================
//  TrustID — pages/Profil.jsx
//  Recherche et affichage du profil public d'un utilisateur
// ============================================================
import React, { useState, useEffect } from 'react';
import { QRCodeSVG }                  from 'qrcode.react';
import { rechercherParEmail, getProfilPublic } from '../services/api';

export default function Profil({ userEmail, userId }) {
  const [recherche,   setRecherche]   = useState('');
  const [profil,      setProfil]      = useState(null);
  const [chargement,  setChargement]  = useState(false);
  const [erreur,      setErreur]      = useState('');

  // Charge le profil de l'utilisateur connecté au montage
  useEffect(() => {
    if (userId) chargerProfilConnecte();
  }, [userId]);

  async function chargerProfilConnecte() {
    setChargement(true);
    setErreur('');
    try {
      const data = await getProfilPublic(userId);
      setProfil(data);
    } catch {
      // Silencieux — l'utilisateur peut chercher manuellement
    } finally {
      setChargement(false);
    }
  }

  async function chercher() {
    if (!recherche.trim()) return setErreur('Entrez un email ou un ID.');
    setChargement(true);
    setErreur('');
    setProfil(null);
    try {
      let data;
      if (recherche.includes('@')) {
        data = await rechercherParEmail(recherche.trim());
      } else {
        data = await getProfilPublic(recherche.trim());
      }
      if (!data?._id) throw new Error('Introuvable');
      setProfil(data);
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Utilisateur introuvable.');
    } finally {
      setChargement(false);
    }
  }

  const s = {
    page:   { maxWidth: 800, margin: '0 auto', padding: '40px 24px' },
    titre:  { fontSize: 28, fontWeight: 700, color: '#1C1C1E', marginBottom: 6 },
    sous:   { fontSize: 15, color: '#8E8E93', marginBottom: 32 },
    carte:  { background: 'white', borderRadius: 20, padding: 28, border: '0.5px solid #E5E5EA', marginBottom: 20 },
    row:    { display: 'flex', gap: 10, marginBottom: 20 },
    input:  { flex: 1, background: '#F2F2F7', border: '0.5px solid #E5E5EA', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#1C1C1E' },
    btn:    { background: '#0F6E56', color: 'white', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' },
    erreur: { color: '#E24B4A', fontSize: 13, marginTop: 8 },
    avatar: { width: 56, height: 56, borderRadius: 16, background: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 700 },
    nom:    { fontSize: 22, fontWeight: 700, color: '#1C1C1E', marginBottom: 4 },
    email:  { fontSize: 14, color: '#8E8E93', marginBottom: 16 },
    badge:  { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#E1F5EE', color: '#085041', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
    champ:  { background: '#F2F2F7', borderRadius: 12, padding: 14, marginBottom: 10 },
    label:  { fontSize: 11, color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 },
    val:    { fontSize: 13, color: '#1C1C1E', fontFamily: 'monospace', wordBreak: 'break-all' },
    qr:     { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 20 },
  };

  return (
    <div style={s.page}>
      <h1 style={s.titre}>Profil public</h1>
      <p style={s.sous}>Votre profil TrustID ou recherchez un autre utilisateur</p>

      <div style={s.carte}>
        <div style={s.row}>
          <input
            style={s.input}
            placeholder="Email ou ID utilisateur"
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && chercher()}
          />
          <button style={s.btn} onClick={chercher} disabled={chargement}>
            {chargement ? '...' : 'Rechercher'}
          </button>
        </div>
        {erreur && <p style={s.erreur}>{erreur}</p>}
      </div>

      {chargement && !profil && (
        <div style={s.carte}>
          <p style={{ color: '#8E8E93', textAlign: 'center' }}>Chargement du profil...</p>
        </div>
      )}

      {profil && (
        <div style={s.carte}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={s.avatar}>
              {profil.nom?.split(' ').map(m => m[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p style={s.nom}>{profil.nom}</p>
              <p style={s.email}>{profil.email || profil.empreintePublique?.substring(0, 20) + '...'}</p>
              <span style={s.badge}>
                ● {profil.certificat?.statut?.toUpperCase() || 'VÉRIFIÉ'}
              </span>
            </div>
          </div>

          <div style={s.champ}>
            <p style={s.label}>Clé publique RSA-2048</p>
            <p style={s.val}>{profil.clePublique?.substring(0, 80)}...</p>
          </div>

          <div style={s.champ}>
            <p style={s.label}>Empreinte</p>
            <p style={s.val}>{profil.empreintePublique}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={s.champ}>
              <p style={s.label}>Certificat émis le</p>
              <p style={s.val}>
                {profil.certificat?.emis
                  ? new Date(profil.certificat.emis).toLocaleDateString('fr-FR')
                  : '—'}
              </p>
            </div>
            <div style={s.champ}>
              <p style={s.label}>Expire le</p>
              <p style={s.val}>
                {profil.certificat?.expire
                  ? new Date(profil.certificat.expire).toLocaleDateString('fr-FR')
                  : '—'}
              </p>
            </div>
          </div>

          <div style={s.qr}>
            <QRCodeSVG
              value={`${window.location.origin}/profil?id=${profil._id}`}
              size={100}
            />
            <p style={{ fontSize: 12, color: '#8E8E93' }}>QR — Profil public vérifiable</p>
          </div>
        </div>
      )}
    </div>
  );
}
