import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth                from './components/Auth';
import Navbar              from './components/Navbar';
import MultiSignRequest    from './components/MultiSignRequest';
import SignatureWorkspace  from './pages/SignatureWorkspace';
import Historique          from './pages/Historique';
import Profil              from './pages/Profil';
import Statistiques        from './pages/Statistiques';
import Verification        from './pages/Verification';

export default function App() {
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem('trustid_email')
  );

  const handleLoginSuccess = (email) => {
    localStorage.setItem('trustid_email', email);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('trustid_email');
    setUserEmail(null);
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

        {/* ── Tableau de bord (après connexion) ─────────────── */}
        <Route
          path="/dashboard"
          element={
            userEmail
              ? <MultiSignRequest user={{ email: userEmail, name: userEmail }} />
              : <Navigate to="/login" replace />
          }
        />

        {/* ── Pages principales ─────────────────────────────── */}
        <Route
          path="/historique"
          element={userEmail ? <Historique userEmail={userEmail} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profil"
          element={userEmail ? <Profil userEmail={userEmail} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/statistiques"
          element={userEmail ? <Statistiques userEmail={userEmail} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/verifier"
          element={<Verification />}
        />

        {/* ── Route publique pour signer via token ──────────── */}
        <Route
          path="/sign"
          element={<SignatureWorkspace userEmail={userEmail} />}
        />

        {/* ── Redirections par défaut ───────────────────────── */}
        <Route
          path="/"
          element={
            userEmail
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}