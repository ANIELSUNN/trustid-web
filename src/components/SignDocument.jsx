export default function SignDocument({ fileName }) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const downloadUrl = `${API_URL}/api/multisign/download/${fileName}`;

  return (
    <div>
      <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
        <button>📥 Télécharger le document pour signature</button>
      </a>
    </div>
  );
}