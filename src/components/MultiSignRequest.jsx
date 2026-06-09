// ============================================================
//  TrustID — src/components/MultiSignRequest.jsx
//  Créer une demande de signature multi-signataires
// ============================================================
import React, { useState, useEffect } from 'react';
import { api } from '../services/api'; // Importation de l'instance configurée

// ── Couleurs TrustID ──────────────────────────────────────────
const GREEN  = '#00664f';

export default function MultiSignRequest({ user }) {
  const [tab, setTab]           = useState('creer');   // 'creer' | 'suivi'
  const [documentName, setDoc]  = useState('');
  const [documentHash, setHash] = useState('');
  const [emails, setEmails]     = useState(['']);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [loadingDemandes, setLoadingDemandes] = useState(false);

  // Chargement des demandes existantes
  useEffect(() => {
    if (tab === 'suivi' && user?.email) {
      setLoadingDemandes(true);
      api.get(`/api/multisign/mes-demandes/${encodeURIComponent(user.email)}`)
        .then(res => { 
          if (res.data.success) setDemandes(res.data.demandes); 
        })
        .catch(() => {})
        .finally(() => setLoadingDemandes(false));
    }
  }, [tab, user]);

  const addEmail    = () => setEmails(prev => [...prev, '']);
  const removeEmail = i  => setEmails(prev => prev.filter((_, idx) => idx !== i));
  const updateEmail = (i, v) => setEmails(prev => prev.map((e, idx) => idx === i ? v : e));

  const handleSubmit = async () => {
    const validEmails = emails.map(e => e.trim()).filter(e => e);
    if (!documentName.trim()) return alert('Veuillez entrer le nom du document.');
    if (!documentHash.trim()) return alert('Veuillez entrer le hash du document.');
    if (!validEmails.length)  return alert('Ajoutez au moins un signataire.');

    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/api/multisign/create', {
        documentName: documentName.trim(),
        documentHash: documentHash.trim(),
        requestedBy:  user?.name  || user?.email || 'Utilisateur',
        requestedByEmail: user?.email || '',
        signatories:  validEmails,
      });
      
      const data = res.data; // Axios place la réponse dans .data
      setResult(data);
      if (data.success) { setDoc(''); setHash(''); setEmails(['']); }
    } catch (err) {
      setResult({ success: false, message: 'Erreur réseau ou serveur.' });
    } finally {
      setLoading(false);
    }
  };

  // ── Styles (inchangés) ───────────────────────────────────────
  const s = {
    wrap:    { maxWidth: 680, margin: '32px auto', padding: '0 16px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' },
    tabs:    { display: 'flex', gap: 0, marginBottom: 24, borderBottom: `2px solid #e9ecef` },
    tab:     (active) => ({ padding: '10px 24px', cursor: 'pointer', border: 'none', background: 'none', fontWeight: active ? 600 : 400, color: active ? GREEN : '#6c757d', borderBottom: active ? `2px solid ${GREEN}` : '2px solid transparent', marginBottom: -2, fontSize: 15 }),
    card:    { background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    label:   { display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14, color: '#212529' },
    input:   { width: '100%', padding: '10px 12px', border: '1px solid #ced4da', borderRadius: 8, fontSize: 15, boxSizing: 'border-box', outline: 'none', background: '#f8f9fa' },
    row:     { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 },
    btnAdd:  { padding: '8px 16px', background: 'none', border: `1px solid ${GREEN}`, color: GREEN, borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 14, marginTop: 4 },
    btnRm:   { padding: '6px 10px', background: '#f8d7da', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#842029', fontWeight: 700, flexShrink: 0 },
    btnMain: { width: '100%', padding: '12px', background: loading ? '#6c757d' : GREEN, color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 },
    alert:   (ok) => ({ padding: '12px 16px', borderRadius: 8, background: ok ? '#d1e7dd' : '#f8d7da', color: ok ? '#0a3622' : '#842029', marginTop: 16, fontSize: 14 }),
    badge:   (s)  => ({ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s === 'signe' ? '#d1e7dd' : '#fff3cd', color: s === 'signe' ? '#0a3622' : '#664d03' }),
    docCard: { background: '#fff', border: '1px solid #e9ecef', borderRadius: 10, padding: '16px 20px', marginBottom: 12 },
    prog:    (pct) => ({ height: 6, borderRadius: 3, background: '#e9ecef', overflow: 'hidden', marginTop: 8 }),
    progFill:(pct) => ({ height: '100%', borderRadius: 3, background: GREEN, width: `${pct}%`, transition: 'width 0.4s' }),
  };

  const percent = (prog) => {
    const [a, b] = prog.split('/').map(Number);
    return b ? Math.round((a / b) * 100) : 0;
  };

  return (
    <div style={s.wrap}>
      <div style={s.tabs}>
        <button style={s.tab(tab === 'creer')} onClick={() => setTab('creer')}>✍️ Nouvelle demande</button>
        <button style={s.tab(tab === 'suivi')} onClick={() => setTab('suivi')}>📋 Mes demandes</button>
      </div>

      {tab === 'creer' && (
        <div style={s.card}>
          <h3 style={{ marginTop: 0, color: GREEN }}>Demande de signature</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={s.label}>Nom du document</label>
            <input style={s.input} placeholder="ex: Contrat de prestation 2025" value={documentName} onChange={e => setDoc(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>Hash SHA-256 du document</label>
            <input style={s.input} placeholder="ex: a3f2c1..." value={documentHash} onChange={e => setHash(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>Adresses email des signataires</label>
            {emails.map((email, i) => (
              <div key={i} style={s.row}>
                <input style={s.input} type="email" placeholder={`signataire${i + 1}@email.com`} value={email} onChange={e => updateEmail(i, e.target.value)} />
                {emails.length > 1 && <button style={s.btnRm} onClick={() => removeEmail(i)}>✕</button>}
              </div>
            ))}
            <button style={s.btnAdd} onClick={addEmail}>+ Ajouter un signataire</button>
          </div>
          <button style={s.btnMain} onClick={handleSubmit} disabled={loading}>{loading ? 'Envoi...' : '📨 Envoyer les invitations'}</button>
          {result && <div style={s.alert(result.success)}><strong>{result.success ? '✅' : '❌'} {result.message}</strong></div>}
        </div>
      )}

      {tab === 'suivi' && (
        <div>
          {loadingDemandes && <p style={{ textAlign: 'center' }}>Chargement...</p>}
          {demandes.map(doc => (
            <div key={doc._id} style={s.docCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><strong>{doc.documentName}</strong></div>
                <span style={s.badge(doc.completed ? 'signe' : 'en_attente')}>{doc.completed ? '✅ Complet' : '⏳ En attente'}</span>
              </div>
              <div style={s.prog(percent(doc.progression))}><div style={s.progFill(percent(doc.progression))} /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}