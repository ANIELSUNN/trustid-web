import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom]         = useState('');
  const [prenom, setPrenom]   = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess(email);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      onLoginSuccess(payload.email);
    } catch {
      onLoginSuccess('utilisateur@google.com');
    }
  };

  const handleGoogleError = () => {
    console.log("Échec de la connexion Google");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Connexion à TrustID" : "Créer un compte TrustID"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Adresse mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-auth">
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <div className="auth-separator">
          <span>ou</span>
        </div>

        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            shape="rectangular"
            width="320px"
          />
        </div>

        <p className="auth-switch-text">
          {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <span onClick={() => setIsLogin(!isLogin)} className="auth-toggle-link">
            {isLogin ? "Créer un compte" : "Se connecter"}
          </span>
        </p>
      </div>
    </div>
  );
}