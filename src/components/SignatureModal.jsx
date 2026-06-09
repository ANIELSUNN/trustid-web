import React, { useRef } from 'react';
import SignatureCanvas from './SignatureCanvas';
import './SignatureModal.css'; // Créez ce fichier CSS pour le style

export default function SignatureModal({ documentUrl, isOpen, onClose, documentId }) {
  const sigRef = useRef();

  const handleSign = async () => {
    const signatureData = sigRef.current.toDataURL(); // Image base64
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents/${documentId}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signatureData }),
    });
    if (response.ok) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Apposer la signature</h2>
        <iframe src={documentUrl} width="100%" height="300px" title="PDF" />
        <SignatureCanvas ref={sigRef} />
        <div className="actions">
          <button onClick={() => sigRef.current.clear()}>Effacer</button>
          <button onClick={handleSign}>Valider la signature</button>
          <button onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}