export default function SignDocument({ fileName }) {
  // Cette URL pointe vers votre API qui sert le fichier
  const downloadUrl = `https://trustid-backend-049u.onrender.com/api/multisign/download/${fileName}`;

  return (
    <div>
      <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
        <button>📥 Télécharger le document pour signature</button>
      </a>
    </div>
  );
}