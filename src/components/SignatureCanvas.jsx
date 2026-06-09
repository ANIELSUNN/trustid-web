import React, { useRef, useState, useEffect } from 'react';

/**
 * SignatureCanvas
 * Composant de dessin de signature sur canvas HTML5.
 *
 * Props:
 *   onSave(dataUrl)  — appelé quand l'utilisateur clique "Valider"
 *   onClear()        — appelé quand l'utilisateur efface
 *   existingSig      — dataUrl d'une signature existante à afficher (optionnel)
 *   width / height   — dimensions internes du canvas (défaut: 580 × 160)
 */
export default function SignatureCanvas({
  onSave,
  onClear,
  existingSig = null,
  width = 580,
  height = 160,
}) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const lastPos = useRef(null);

  // ── Initialisation du canvas ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8faf9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (existingSig) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = existingSig;
      setHasStrokes(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Utilitaire: position relative au canvas ───────────────────────────────────
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // ── Dessin ────────────────────────────────────────────────────────────────────
  const startDraw = (e) => {
    e.preventDefault();
    setDrawing(true);
    setHasStrokes(true);
    lastPos.current = getPos(e);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#00664f';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => setDrawing(false);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8faf9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
    if (onClear) onClear();
  };

  const save = () => {
    if (!hasStrokes) return;
    onSave(canvasRef.current.toDataURL('image/png'));
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Zone de dessin */}
      <div
        style={{
          border: '2px dashed #b3d9d2',
          borderRadius: 12,
          overflow: 'hidden',
          cursor: 'crosshair',
          background: '#f8faf9',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ width: '100%', height: height, display: 'block' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      {/* Aide visuelle */}
      {!hasStrokes && (
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b8c85', textAlign: 'center' }}>
          ✏️ Tracez votre signature à l'intérieur de la zone
        </p>
      )}

      {/* Boutons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={clear}
          style={{
            background: 'transparent',
            color: '#00664f',
            border: '1.5px solid #b3d9d2',
            borderRadius: 8,
            padding: '0.6rem 1.2rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          ✕ Effacer
        </button>
        <button
          onClick={save}
          disabled={!hasStrokes}
          style={{
            background: '#00664f',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.6rem 1.2rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: hasStrokes ? 'pointer' : 'not-allowed',
            opacity: hasStrokes ? 1 : 0.4,
            transition: 'opacity 0.15s',
          }}
        >
          ✓ Valider la signature
        </button>
      </div>
    </div>
  );
}
