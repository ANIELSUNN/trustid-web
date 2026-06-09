import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { api } from '../services/api';
import styles from '../components/SignatureWorkspace.module.css';

export default function SignatureWorkspace() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [docInfo, setDocInfo] = useState(null);
  const sigPad = useRef(null);

  useEffect(() => {
    if (!token) {
      setError("Aucun jeton fourni dans l'URL.");
      setLoading(false);
      return;
    }
    api.get(`/api/sign/verify-token?token=${token}`)
      .then(res => { setDocInfo(res.data.data); setLoading(false); })
      .catch(() => { setError("Erreur de vérification."); setLoading(false); });
  }, [token]);

  const saveSignature = async () => {
    const signatureImageBase64 = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
    try {
      await api.post('/api/sign/submit', { token, signatureData: signatureImageBase64 });
      alert("Signature enregistrée !");
    } catch (err) { alert("Erreur réseau"); }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className={styles['sw-state-error']}>{error}</div>;

  return (
    <div className={styles['sw-root']}>
      <div className={styles['sw-card']}>
        <h2>{docInfo?.documentName || "Document"}</h2>
        <div className={styles['sw-doc-body']}>
          <SignatureCanvas ref={sigPad} canvasProps={{ width: 500, height: 200, className: styles['sw-sig-zone'] }} />
        </div>
        <button className={styles['sw-btn-primary']} onClick={saveSignature}>Confirmer et Signer</button>
      </div>
    </div>
  );
}