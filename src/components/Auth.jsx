// ============================================================
//  TrustID — src/components/Auth.jsx
//  Authentification avec auto-register (clé RSA générée côté client)
// ============================================================
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';

// Génère une paire de clés RSA-2048 dans le navigateur via Web Crypto API
async function genererCleRSA() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  );

  const pubKey  = await window.crypto.subtle.exportKey('spki',  keyPair.publicKey);
  const privKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  const toBase64 = (buf) =>
    btoa(String.fromCharCode(...new Uint8Array(buf)));

  const clePublique = `-----BEGIN PUBLIC KEY-----\n${toBase64(pubKey)}\n-----END PUBLIC KEY-----`;
  const clePrivee   = `-----BEGIN PRIVATE KEY-----\n${toBase64(privKey)}\n-----END PRIVATE KEY-----`;

  return { clePublique, clePrivee };
}

export default function Auth({ onLoginSuccess }) {
  const [isLogin,  setIsLogin]  = useState(true);
  const [email,    setEmail]    = useState('');
  const [nom,      setNom]      = useState('');
  const [prenom,   setPrenom]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [erreur,   setErreur]   = useState('');

  // Logique principale : cherche le compte, le crée si absent
  const connecterOuCreer = async (emailVal, nomVal = '') => {
    setLoading(true);
    setErreur('');
    try {
      const BASE = process.env.REACT_APP_API_URL;

      // 1. Vérifie si le compte existe déjà
      const resRecherche = await fetch(
        `${BASE}/api/auth/recherche?email=${encodeURIComponent(emailVal.toLowerCase())}`
      );
      const userExistant = await resRecherche.json();

      if (userExistant?._id) {
        // Compte trouvé → connexion directe
        localStorage.setItem('trustid_cle_publique', userExistant.clePublique);
        onLoginSuccess(userExistant.email, userExistant._id);
        return;
      }

      // 2. Compte absent → génère les clés RSA et crée le compte
      const { clePublique, clePrivee } = await genererCleRSA();

      // La clé privée ne quitte jamais le navigateur
      localStorage.setItem('trustid_cle_privee',   clePrivee);
      localStorage.setItem('trustid_cle_publique',  clePublique);

      const nomFinal = nomVal.trim() || emailVal.split('@')[0];

      const resRegister = await fetch(`${BASE}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nomFinal,
          email: emailVal.toLowerCase(),
          clePublique,
        }),
      });

      const data = await resRegister.json();

      if (!resRegister.ok) {
        setErreur(data.erreur || 'Erreur lors de la création du compte.');
        return;
      }

      onLoginSuccess(data.utilisateur.email, data.utilisateur._id);
    } catch (err) {
      setErreur('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    connecterOuCreer(email, `${nom} ${prenom}`.trim());
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      await connecterOuCreer(payload.email, payload.name || '');
    } catch {
      setErreur('Erreur lors de la connexion Google.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Connexion à TrustID' : 'Créer un compte TrustID'}</h2>

        {erreur && (
          <p style={{ color: '#E24B4A', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
            {erreur}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={e => setPrenom(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Adresse mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="auth-separator">
          <span>ou</span>
        </div>

        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErreur('Échec de la connexion Google.')}
            theme="outline"
            size="large"
            shape="rectangular"
            width="320px"
          />
        </div>

        <p className="auth-switch-text">
          {isLogin ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
          <span onClick={() => { setIsLogin(!isLogin); setErreur(''); }} className="auth-toggle-link">
            {isLogin ? 'Créer un compte' : 'Se connecter'}
          </span>
        </p>
      </div>
    </div>
  );
}
