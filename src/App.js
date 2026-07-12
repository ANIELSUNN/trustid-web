// ============================================================
//  TrustID — src/App.jsx
//  Routeur principal + gestion de session (email + id)
// ============================================================
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth               from './components/Auth';
import Navbar             from './components/Navbar';
import MultiSignRequest   from './components/MultiSignRequest';
import Landing            from './pages/Landing';
import UploadAndSign      from './pages/UploadAndSign';
import SignatureWorkspace from './pages/SignatureWorkspace';
import MailerTester       from './pages/MailerTester';
import Historique         from './pages/Historique';
import Profil             from './pages/Profil';
import Statistiques       from './pages/Statistiques';
import Verification       from './pages/Verification';

export default function App() {
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem('trustid_email')
  );
  const [userId, setUserId] = useState(
    () => localStorage.getItem('trustid_id')
  );

  const handleLoginSuccess = (email, id) => {
    localStorage.setItem('trustid_email', email);
    localStorage.setItem('trustid_id',    id);
    setUserEmail(email);
    setUserId(id);
  };

  const handleLogout = () => {
    ['trustid_email', 'trustid_id', 'trustid_cle_privee', 'trustid_cle_publique']
      .forEach(k => localStorage.removeItem(k));
    setUserEmail(null);
    setUserId(null);
  };

  return (
    <BrowserRouter>
      {userEmail && <Navbar userEmail={userEmail} onLogout={handleLogout} />}

      <Routes>
        {/* ── Auth ──────────────────────────────────────────── */}
        <Route
          path="/login"
          element={
            userEmail
              ? <Navigate to="/dashboard" replace />
              : <Auth onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/* ── Tableau de bord ───────────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            userEmail
              ? <MultiSignRequest user={{ email: userEmail, name: userEmail, id: userId }} />
              : <Navigate to="/login" replace />
          }
        />

        {/* ── Pages principales ─────────────────────────────── */}
        <Route
          path="/historique"
          element={
            userEmail
              ? <Historique userEmail={userEmail} userId={userId} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/profil"
          element={
            userEmail
              ? <Profil userEmail={userEmail} userId={userId} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/statistiques"
          element={
            userEmail
              ? <Statistiques userEmail={userEmail} userId={userId} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/upload-sign"
          element={
            userEmail
              ? <UploadAndSign user={{ email: userEmail, id: userId }} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/test-mailer"
          element={
            userEmail
              ? <MailerTester user={{ email: userEmail, id: userId }} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/verifier"
          element={<Verification />}
        />

        {/* ── Routes publiques pour signer via token ──────────── */}
        <Route
          path="/sign"
          element={<SignatureWorkspace userEmail={userEmail} />}
        />
        <Route
          path="/signer"
          element={<SignatureWorkspace userEmail={userEmail} />}
        />

        {/* ── Redirections par défaut ───────────────────────── */}
        <Route
          path="/"
          element={
            userEmail
              ? <Navigate to="/dashboard" replace />
              : <Landing />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
