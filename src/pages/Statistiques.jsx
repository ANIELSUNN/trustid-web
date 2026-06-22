// ============================================================
//  TrustID — pages/Statistiques.jsx
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { healthCheck } from '../services/api';

const donneesBarre = [
  { jour: 'Lun', signatures: 3 },
  { jour: 'Mar', signatures: 5 },
  { jour: 'Mer', signatures: 2 },
  { jour: 'Jeu', signatures: 8 },
  { jour: 'Ven', signatures: 6 },
  { jour: 'Sam', signatures: 1 },
  { jour: 'Dim', signatures: 4 },
];

const donneesPie = [
  { name: 'Contrats', value: 45 },
  { name: 'Rapports', value: 25 },
  { name: 'Mandats',  value: 15 },
  { name: 'Autres',   value: 15 },
];

const COULEURS_PIE = ['#0F6E56', '#185FA5', '#854F0B', '#8E8E93'];

export default function Statistiques({ userEmail, userId }) {
  const [backendOk, setBackendOk] = useState(null);

  useEffect(() => {
    healthCheck()
      .then((res) => {
        // La route /health renvoie "OK"
        if (res === 'OK') {
          setBackendOk(true);
        } else {
          setBackendOk(false);
        }
      })
      .catch(() => setBackendOk(false));
  }, []);

  const s = {
    page:    { maxWidth: 1000, margin: '0 auto', padding: '40px 24px' },
    titre:   { fontSize: 28, fontWeight: 700, color: '#1C1C1E', marginBottom: 6 },
    sous:    { fontSize: 15, color: '#8E8E93', marginBottom: 32 },
    grille4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
    grille2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
    carte:   { background: 'white', borderRadius: 20, padding: 24, border: '0.5px solid #E5E5EA' },
    kpiVal:  { fontSize: 32, fontWeight: 700, color: '#1C1C1E', marginBottom: 4 },
    kpiLbl:  { fontSize: 13, color: '#8E8E93' },
    kpiTnd:  { fontSize: 12, color: '#0F6E56', fontWeight: 600, marginTop: 4 },
    carteH2: { fontSize: 16, fontWeight: 700, color: '#1C1C1E', marginBottom: 20 },
  };

  const kpis = [
    { val: '29',   label: 'Signatures totales',  tendance: '+12 ce mois' },
    { val: '100%', label: 'Taux de validité',    tendance: '0 rejet' },
    { val: '1',    label: 'Utilisateurs actifs', tendance: 'Ce mois' },
    {
      val:      backendOk === null ? '...' : backendOk ? '✅' : '❌',
      label:    'Statut backend',
      tendance: backendOk === null ? '...' : backendOk ? 'en ligne' : 'hors ligne',
    },
  ];

  return (
    <div style={s.page}>
      <h1 style={s.titre}>Statistiques</h1>
      <p style={s.sous}>Vue d'ensemble de l'activité TrustID</p>

      {/* KPIs */}
      <div style={s.grille4}>
        {kpis.map((k, i) => (
          <div key={i} style={s.carte}>
            <p style={s.kpiVal}>{k.val}</p>
            <p style={s.kpiLbl}>{k.label}</p>
            <p style={{ ...s.kpiTnd, color: i === 3 && backendOk === false ? '#E24B4A' : '#0F6E56' }}>
              {k.tendance}
            </p>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div style={s.grille2}>
        <div style={s.carte}>
          <h2 style={s.carteH2}>Signatures par jour (7 derniers jours)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={donneesBarre} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F7" />
              <XAxis dataKey="jour" tick={{ fontSize: 12, fill: '#8E8E93' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8E8E93' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '0.5px solid #E5E5EA', fontSize: 13 }}
                cursor={{ fill: '#F2F2F7' }}
              />
              <Bar dataKey="signatures" fill="#0F6E56" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={s.carte}>
          <h2 style={s.carteH2}>Répartition par type de document</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={donneesPie}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {donneesPie.map((_, i) => (
                  <Cell key={i} fill={COULEURS_PIE[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
