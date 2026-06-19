import React, { useState } from 'react';

const SignatureWorkspace = () => {
  const [signature, setSignature] = useState('');

  const handleChange = (e) => {
    setSignature(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu peux envoyer la signature vers ton backend
    console.log('Signature envoyée :', signature);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Signature Workspace</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={signature}
          onChange={handleChange}
          placeholder="Écris ou colle ta signature ici..."
          rows={5}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit">Valider la signature</button>
      </form>
    </div>
  );
};

export default SignatureWorkspace;
