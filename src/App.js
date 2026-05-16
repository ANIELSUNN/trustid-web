// ============================================================
//  TrustID — Dashboard Web — App.js
// ============================================================

import React          from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar         from './components/Navbar';
import Verification   from './pages/Verification';
import Profil         from './pages/Profil';
import Historique     from './pages/Historique';
import Statistiques   from './pages/Statistiques';

import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"             element={<Verification />} />
          <Route path="/profil"       element={<Profil />}       />
          <Route path="/historique"   element={<Historique />}   />
          <Route path="/statistiques" element={<Statistiques />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
