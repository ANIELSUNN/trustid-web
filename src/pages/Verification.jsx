// ============================================================
//  TrustID — pages/Verification.jsx
//  Vérification publique d'une signature via ID ou drag & drop
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDropzone }      from 'react-dropzone';
import { QRCodeSVG }        from 'qrcode.react';
import { verifierSignature } from '../services/api';
import { connecterWS, deconnecterWS } from '../services/websocket';
import TrustIDLogo          from '../components/TrustIDLogo';
import styles               from './Verification.module.css';

export default function Verification() {
  const navigate                        = useNavigate();
  const [searchParams]                  = useSearchParams();
  const [signatureId,   setSignatureId] = useState('');
  const [resultat,      setResultat]    = useState(null);
  const [chargement,    setChargement]  = useState(false);
  const [erreur,        setErreur]      = useState('');
  const [notifLive,     setNotifLive]   = useState(null);

  // Auto-vérification si ?id= présent dans l'URL (scan QR code)
  useEffect(() => {
    const idUrl = searchParams.get('id');
    if (idUrl) {
      setSignatureId(idUrl);
      verifierAvecId(idUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------
  // WebSocket — notification temps réel quand une signature arrive
  // ----------------------------------------------------------------
  useEffect(() => {
    connecterWS({
      nouvelle_signature: (donnees) => {
        setNotifLive(donnees);
        // Auto-disparition après 8 secondes
        setTimeout(() => setNotifLive(null), 8000);
      },
    });
    return () => deconnecterWS();
  }, []);

  // ----------------------------------------------------------------
  // Vérification par ID
  // ----------------------------------------------------------------
  async function verifierAvecId(id) {
    setChargement(true);
    setErreur('');
    setResultat(null);
    try {
      const data = await verifierSignature(id);
      setResultat(data);
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Signature introuvable.');
    } finally {
      setChargement(false);
    }
  }

  async function verifier(id) {
    const idNettoye = (id || signatureId).trim();
    if (!idNettoye) return setErreur('Entrez un ID de signature.');
    await verifierAvecId(idNettoye);
  }

  // ----------------------------------------------------------------
  // Drag & Drop (affiche juste le hash pour l'instant)
  // ----------------------------------------------------------------
  const onDrop = useCallback((fichiers) => {
    const fichier = fichiers[0];
    if (!fichier) return;
    setErreur(`Fichier reçu : ${fichier.name} — entrez l'ID de signature pour vérifier.`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  // ----------------------------------------------------------------
  // RENDU
  // ----------------------------------------------------------------
  return (
    <div className={styles.page}>

      {/* Notification live WebSocket */}
      {notifLive && (
        <div className={styles.notifLive}>
          <span>🔔</span>
          <div>
            <strong>Nouvelle signature reçue !</strong>
            <p>{notifLive.nomFichier} — {new Date(notifLive.date).toLocaleTimeString('fr-FR')}</p>
          </div>
          <button onClick={() => verifier(notifLive.signatureId)}>Vérifier →</button>
        </div>
      )}

      <div className={styles.topBar}>
        <button type="button" className={styles.retour} onClick={() => navigate(-1)}>← Retour</button>
        <Link to="/" className={styles.accueil}><TrustIDLogo size={26} /></Link>
      </div>

      <div className={styles.entete}>
        <h1>Vérification de signature</h1>
        <p>Vérifiez l'authenticité cryptographique d'un document signé avec TrustID</p>
      </div>

      <div className={styles.grille}>

        {/* Zone de saisie de l'ID */}
        <div className={styles.carte}>
          <h2>🔍 Par ID de signature</h2>
          <p className={styles.desc}>Entrez l'identifiant unique de la signature (scanné via QR code)</p>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              placeholder="ex: 64f2a3b1c9e4f5d6a7b8c9d0"
              value={signatureId}
              onChange={e => setSignatureId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verifier()}
            />
            <button
              className={styles.bouton}
              onClick={() => verifier()}
              disabled={chargement}
            >
              {chargement ? '...' : 'Vérifier'}
            </button>
          </div>
          {erreur && <p className={styles.erreur}>{erreur}</p>}
        </div>

        {/* Zone drag & drop */}
        <div className={styles.carte}>
          <h2>📂 Par glisser-déposer</h2>
          <p className={styles.desc}>Déposez le PDF signé pour extraire son ID</p>
          <div
            {...getRootProps()}
            className={`${styles.drop} ${isDragActive ? styles.dropActif : ''}`}
          >
            <input {...getInputProps()} />
            <span className={styles.dropIcone}>📄</span>
            <p>{isDragActive ? 'Déposez ici...' : 'Glissez un PDF ou cliquez'}</p>
          </div>
        </div>

      </div>

      {/* Résultat de vérification */}
      {resultat && <ResultatVerif resultat={resultat} />}

    </div>
  );
}

// ----------------------------------------------------------------
// Composant résultat
// ----------------------------------------------------------------
function ResultatVerif({ resultat }) {
  const valide = resultat.verificationLive;
  const styles2 = {
    conteneur: {
      marginTop: 32,
      background: 'white',
      borderRadius: 20,
      padding: 32,
      border: `1.5px solid ${valide ? '#1D9E75' : '#E24B4A'}`,
      maxWidth: 720,
      margin: '32px auto 0',
    },
    entete: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 },
    badge: {
      display: 'flex', alignItems: 'center', gap: 8,
      background: valide ? '#E1F5EE' : '#FCEBEB',
      color: valide ? '#085041' : '#791F1F',
      padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: 700,
    },
    grille: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
    champ: { background: '#F2F2F7', borderRadius: 12, padding: 14 },
    label: { fontSize: 11, color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 },
    valeur: { fontSize: 14, color: '#1C1C1E', fontWeight: 500, fontFamily: 'monospace', wordBreak: 'break-all' },
    qr: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
    qrLabel: { fontSize: 12, color: '#8E8E93' },
  };

  return (
    <div style={styles2.conteneur}>
      <div style={styles2.entete}>
        <span style={{ fontSize: 40 }}>{valide ? '✅' : '❌'}</span>
        <div>
          <div style={styles2.badge}>
            {valide ? '✓ SIGNATURE VALIDE' : '✗ SIGNATURE INVALIDE'}
          </div>
          <p style={{ marginTop: 6, color: '#8E8E93', fontSize: 14 }}>{resultat.message}</p>
        </div>
      </div>

      <div style={styles2.grille}>
        <div style={styles2.champ}>
          <p style={styles2.label}>Document</p>
          <p style={styles2.valeur}>{resultat.nomFichier}</p>
        </div>
        <div style={styles2.champ}>
          <p style={styles2.label}>Signataire</p>
          <p style={styles2.valeur}>{resultat.userId?.nom || '—'}</p>
        </div>
        <div style={styles2.champ}>
          <p style={styles2.label}>Hash SHA-256</p>
          <p style={styles2.valeur}>{resultat.hashDocument?.substring(0, 20)}...</p>
        </div>
        <div style={styles2.champ}>
          <p style={styles2.label}>Horodatage</p>
          <p style={styles2.valeur}>
            {resultat.horodatage?.dateCertifiee
              ? new Date(resultat.horodatage.dateCertifiee).toLocaleString('fr-FR')
              : '—'}
          </p>
        </div>
        <div style={styles2.champ}>
          <p style={styles2.label}>Date de signature</p>
          <p style={styles2.valeur}>
            {resultat.createdAt ? new Date(resultat.createdAt).toLocaleString('fr-FR') : '—'}
          </p>
        </div>
        <div style={styles2.champ}>
          <p style={styles2.label}>Statut</p>
          <p style={{ ...styles2.valeur, color: valide ? '#0F6E56' : '#E24B4A' }}>
            {resultat.statut?.toUpperCase()}
          </p>
        </div>
      </div>

      {/* QR code de vérification */}
      {resultat.urlVerification && (
        <div style={styles2.qr}>
          <QRCodeSVG value={resultat.urlVerification} size={120} />
          <p style={styles2.qrLabel}>QR code de vérification publique</p>
        </div>
      )}
    </div>
  );
}
