import { useState, useRef, useEffect } from "react";

const COLORS = {
  green: "#00664f",
  greenDark: "#004d3b",
  greenLight: "#e6f4f1",
  greenBorder: "#b3d9d2",
  bg: "#f4f7f5",
  white: "#ffffff",
  text: "#1a2e28",
  muted: "#6b8c85",
  border: "#d0ddd9",
  danger: "#c0392b",
  amber: "#e67e22",
};

const styles = {
  app: {
    fontFamily: "'Instrument Sans', 'Segoe UI', system-ui, sans-serif",
    background: COLORS.bg,
    minHeight: "100vh",
    color: COLORS.text,
  },
  card: {
    background: COLORS.white,
    borderRadius: 16,
    border: `1px solid ${COLORS.border}`,
    padding: "2rem",
    boxShadow: "0 2px 12px rgba(0,102,79,0.06)",
  },
  btn: {
    background: COLORS.green,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "0.7rem 1.4rem",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background 0.15s",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  btnOutline: {
    background: "transparent",
    color: COLORS.green,
    border: `1.5px solid ${COLORS.greenBorder}`,
    borderRadius: 10,
    padding: "0.65rem 1.3rem",
    fontWeight: 600,
    fontSize: "0.92rem",
    cursor: "pointer",
    transition: "all 0.15s",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  btnDanger: {
    background: "#fff0ef",
    color: COLORS.danger,
    border: `1px solid #f5c6c2`,
    borderRadius: 10,
    padding: "0.5rem 1rem",
    fontWeight: 600,
    fontSize: "0.88rem",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    fontSize: "0.95rem",
    background: "#f8faf9",
    outline: "none",
    boxSizing: "border-box",
    color: COLORS.text,
    transition: "border-color 0.15s",
  },
  label: {
    fontSize: "0.88rem",
    fontWeight: 600,
    color: COLORS.muted,
    marginBottom: 6,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  badge: (status) => {
    const map = {
      signed: { bg: "#e6f4f1", color: "#00664f" },
      pending: { bg: "#fff8e6", color: "#a0620c" },
      waiting: { bg: "#edf2ff", color: "#2d4db5" },
      refused: { bg: "#fee8e8", color: "#c0392b" },
    };
    const s = map[status] || map.pending;
    return {
      background: s.bg,
      color: s.color,
      borderRadius: 20,
      padding: "3px 12px",
      fontSize: "0.78rem",
      fontWeight: 700,
      display: "inline-block",
    };
  },
  avatar: (initials, color = COLORS.green) => ({
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: COLORS.greenLight,
    color: COLORS.green,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.85rem",
    flexShrink: 0,
    border: `1.5px solid ${COLORS.greenBorder}`,
  }),
};

// ─── SIGNATURE CANVAS ──────────────────────────────────────────────────────────
function SignatureCanvas({ onSave, onClear, existingSig }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const lastPos = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f8faf9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (existingSig) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = existingSig;
      setHasStrokes(true);
    }
  }, []);

  const getPos = (e, canvas) => {
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

  const startDraw = (e) => {
    e.preventDefault();
    setDrawing(true);
    setHasStrokes(true);
    lastPos.current = getPos(e, canvasRef.current);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#00664f";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f8faf9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
    if (onClear) onClear();
  };

  const save = () => {
    if (!hasStrokes) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div>
      <div
        style={{
          border: `2px dashed ${COLORS.greenBorder}`,
          borderRadius: 12,
          overflow: "hidden",
          cursor: "crosshair",
          background: "#f8faf9",
          touchAction: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          width={580}
          height={160}
          style={{ width: "100%", height: 160, display: "block" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button style={styles.btnOutline} onClick={clear}>
          ✕ Effacer
        </button>
        <button
          style={{
            ...styles.btn,
            opacity: hasStrokes ? 1 : 0.4,
            cursor: hasStrokes ? "pointer" : "not-allowed",
          }}
          onClick={save}
          disabled={!hasStrokes}
        >
          ✓ Valider la signature
        </button>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ──────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      email,
      name: isLogin ? email.split("@")[0] : `${prenom} ${nom}`,
      initials: isLogin
        ? email[0].toUpperCase()
        : `${prenom[0] || ""}${nom[0] || ""}`.toUpperCase(),
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: COLORS.bg,
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: "0.7rem 1.4rem",
              boxShadow: "0 2px 8px rgba(0,102,79,0.08)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill={COLORS.green} />
              <path
                d="M14 6L7 10v4c0 4.4 3 8.5 7 9.5 4-1 7-5.1 7-9.5v-4L14 6z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M11.5 14l2 2 4-4"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontWeight: 700,
                fontSize: "1.2rem",
                color: COLORS.green,
                letterSpacing: "-0.02em",
              }}
            >
              TrustID
            </span>
          </div>
        </div>

        <div style={styles.card}>
          <h2
            style={{
              margin: "0 0 0.3rem",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: COLORS.text,
            }}
          >
            {isLogin ? "Connexion" : "Créer un compte"}
          </h2>
          <p
            style={{
              margin: "0 0 1.5rem",
              color: COLORS.muted,
              fontSize: "0.9rem",
            }}
          >
            {isLogin
              ? "Bon retour sur TrustID"
              : "Rejoignez TrustID gratuitement"}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={styles.label}>Prénom</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Jean"
                    required
                  />
                </div>
                <div>
                  <label style={styles.label}>Nom</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Dupont"
                    required
                  />
                </div>
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={styles.label}>Adresse email</label>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={styles.label}>Mot de passe</label>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button style={{ ...styles.btn, width: "100%", justifyContent: "center", padding: "0.85rem" }} type="submit">
              {isLogin ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "1.25rem 0",
              gap: 10,
            }}
          >
            <div style={{ flex: 1, height: 1, background: COLORS.border }} />
            <span style={{ fontSize: "0.82rem", color: COLORS.muted }}>ou</span>
            <div style={{ flex: 1, height: 1, background: COLORS.border }} />
          </div>

          <button
            style={{
              ...styles.btnOutline,
              width: "100%",
              justifyContent: "center",
              padding: "0.8rem",
            }}
            onClick={() =>
              onLogin({ email: "demo@trustid.com", name: "Demo User", initials: "DU" })
            }
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continuer avec Google
          </button>

          <p style={{ textAlign: "center", margin: "1.2rem 0 0", fontSize: "0.88rem", color: COLORS.muted }}>
            {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <span
              style={{ color: COLORS.green, fontWeight: 700, cursor: "pointer" }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── INVITE SIGNERS MODAL ───────────────────────────────────────────────────────
function InviteModal({ onClose, onSend, existingSigners }) {
  const [emails, setEmails] = useState([""]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const addEmail = () => setEmails([...emails, ""]);
  const updateEmail = (i, v) => {
    const ne = [...emails];
    ne[i] = v;
    setEmails(ne);
  };
  const removeEmail = (i) => setEmails(emails.filter((_, j) => j !== i));

  const handleSend = () => {
    const valid = emails.filter((e) => e.includes("@"));
    if (valid.length === 0) return;
    setSent(true);
    setTimeout(() => {
      onSend(valid);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,30,25,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ ...styles.card, width: "100%", maxWidth: 480, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Inviter des signataires</h3>
            <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: "0.86rem" }}>
              Un email avec le lien de signature sera envoyé
            </p>
          </div>
          <button onClick={onClose} style={{ ...styles.btnDanger, padding: "0.4rem 0.8rem" }}>✕</button>
        </div>

        {sent ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>✉️</div>
            <p style={{ fontWeight: 700, color: COLORS.green, fontSize: "1.05rem", margin: 0 }}>
              Invitations envoyées !
            </p>
            <p style={{ color: COLORS.muted, fontSize: "0.88rem", marginTop: 6 }}>
              Les signataires recevront un email avec le lien de signature.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={styles.label}>Adresses email des signataires</label>
              {emails.map((email, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input
                    style={{ ...styles.input, flex: 1 }}
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(i, e.target.value)}
                    placeholder="signataire@exemple.com"
                  />
                  {emails.length > 1 && (
                    <button onClick={() => removeEmail(i)} style={styles.btnDanger}>
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button style={{ ...styles.btnOutline, fontSize: "0.85rem", padding: "0.5rem 1rem", marginTop: 4 }} onClick={addEmail}>
                + Ajouter un signataire
              </button>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={styles.label}>Message personnalisé (optionnel)</label>
              <textarea
                style={{ ...styles.input, height: 80, resize: "vertical", fontFamily: "inherit" }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Merci de signer ce document avant vendredi..."
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={styles.btnOutline} onClick={onClose}>Annuler</button>
              <button style={styles.btn} onClick={handleSend}>
                ✉ Envoyer les invitations
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── DOCUMENT SIGNING PAGE ──────────────────────────────────────────────────────
function DocumentSignPage({ doc, user, onBack, onUpdate }) {
  const [showInvite, setShowInvite] = useState(false);
  const [signingFor, setSigningFor] = useState(null);
  const [savedSig, setSavedSig] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const mySignerEntry = doc.signers.find((s) => s.email === user.email);
  const mySigned = mySignerEntry?.status === "signed";

  const handleSaveSignature = (dataUrl) => {
    setSavedSig(dataUrl);
  };

  const handleConfirmSign = () => {
    if (!savedSig) return;
    const updated = {
      ...doc,
      signers: doc.signers.map((s) =>
        s.email === user.email
          ? { ...s, status: "signed", signedAt: new Date().toLocaleString("fr-FR"), sig: savedSig }
          : s
      ),
    };
    const allSigned = updated.signers.every((s) => s.status === "signed");
    if (allSigned) updated.status = "completed";
    onUpdate(updated);
    setSigningFor(null);
    setSavedSig(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInvite = (newEmails) => {
    const updated = {
      ...doc,
      signers: [
        ...doc.signers,
        ...newEmails
          .filter((e) => !doc.signers.find((s) => s.email === e))
          .map((e) => ({ email: e, name: e.split("@")[0], status: "pending", invited: true })),
      ],
    };
    onUpdate(updated);
  };

  const progress = Math.round(
    (doc.signers.filter((s) => s.status === "signed").length / doc.signers.length) * 100
  );

  return (
    <div style={{ padding: "1.5rem", maxWidth: 780, margin: "0 auto" }}>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onSend={handleInvite} existingSigners={doc.signers} />}

      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: COLORS.green,
            color: "#fff",
            borderRadius: 12,
            padding: "0.9rem 1.4rem",
            fontWeight: 700,
            zIndex: 999,
            boxShadow: "0 4px 20px rgba(0,102,79,0.3)",
            animation: "none",
          }}
        >
          ✓ Signature enregistrée !
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.5rem" }}>
        <button style={styles.btnOutline} onClick={onBack}>
          ← Retour
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>{doc.title}</h2>
          <span style={{ fontSize: "0.82rem", color: COLORS.muted }}>
            Créé le {doc.createdAt} · {doc.signers.length} signataire{doc.signers.length > 1 ? "s" : ""}
          </span>
        </div>
        <button style={styles.btn} onClick={() => setShowInvite(true)}>
          + Inviter
        </button>
      </div>

      {/* Progress */}
      <div style={{ ...styles.card, marginBottom: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>Avancement des signatures</span>
          <span style={{ fontWeight: 700, color: COLORS.green }}>{progress}%</span>
        </div>
        <div style={{ height: 8, background: COLORS.greenLight, borderRadius: 99 }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: COLORS.green,
              borderRadius: 99,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <div style={{ marginTop: 8, fontSize: "0.82rem", color: COLORS.muted }}>
          {doc.signers.filter((s) => s.status === "signed").length} sur {doc.signers.length} ont signé
        </div>
      </div>

      {/* Document preview */}
      <div style={{ ...styles.card, marginBottom: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Document</h3>
          <span style={styles.badge(doc.status === "completed" ? "signed" : "pending")}>
            {doc.status === "completed" ? "✓ Complété" : "En cours"}
          </span>
        </div>

        {/* Mock document content */}
        <div
          style={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: "1.5rem",
            background: "#fafcfb",
            fontFamily: "'Georgia', serif",
            fontSize: "0.9rem",
            lineHeight: 1.8,
            color: "#2a3d35",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <strong style={{ fontSize: "1rem" }}>{doc.title}</strong>
          </div>
          <p>{doc.content || "Ce document requiert la signature des parties mentionnées ci-dessous. En apposant leur signature, les signataires attestent avoir pris connaissance du contenu de ce document et l'acceptent dans son intégralité."}</p>

          {/* Signature zones */}
          <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {doc.signers.map((signer) => (
              <div
                key={signer.email}
                style={{
                  border: `1.5px dashed ${signer.status === "signed" ? COLORS.green : COLORS.border}`,
                  borderRadius: 10,
                  padding: "0.8rem",
                  background: signer.status === "signed" ? COLORS.greenLight : "#fff",
                  minHeight: 90,
                }}
              >
                <div style={{ fontSize: "0.75rem", color: COLORS.muted, marginBottom: 6, fontFamily: "sans-serif" }}>
                  {signer.name || signer.email}
                </div>
                {signer.sig ? (
                  <>
                    <img src={signer.sig} alt="Signature" style={{ maxWidth: "100%", height: 50, objectFit: "contain" }} />
                    <div style={{ fontSize: "0.7rem", color: COLORS.green, fontFamily: "sans-serif", marginTop: 4 }}>
                      ✓ {signer.signedAt}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: "0.78rem", color: COLORS.muted, fontFamily: "sans-serif", fontStyle: "italic" }}>
                    En attente de signature...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign action for current user */}
      {!mySigned && mySignerEntry && (
        <div style={{ ...styles.card, border: `2px solid ${COLORS.greenBorder}`, marginBottom: "1.2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 700 }}>Votre signature</h3>
            <p style={{ margin: 0, color: COLORS.muted, fontSize: "0.86rem" }}>
              Dessinez votre signature dans la zone ci-dessous
            </p>
          </div>
          <SignatureCanvas
            onSave={handleSaveSignature}
            onClear={() => setSavedSig(null)}
          />
          {savedSig && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: "0.84rem", color: COLORS.muted, marginBottom: 8 }}>
                Aperçu de votre signature :
              </div>
              <img src={savedSig} style={{ height: 60, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 4 }} />
              <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                <button style={styles.btn} onClick={handleConfirmSign}>
                  ✓ Confirmer et signer le document
                </button>
                <button style={styles.btnOutline} onClick={() => setSavedSig(null)}>
                  Recommencer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mySigned && (
        <div
          style={{
            ...styles.card,
            border: `1.5px solid ${COLORS.greenBorder}`,
            background: COLORS.greenLight,
            marginBottom: "1.2rem",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: COLORS.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            ✓
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: COLORS.green }}>Vous avez signé ce document</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: COLORS.muted }}>
              Signé le {mySignerEntry.signedAt}
            </p>
          </div>
        </div>
      )}

      {/* Signers list */}
      <div style={styles.card}>
        <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 700 }}>
          Signataires ({doc.signers.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {doc.signers.map((signer) => (
            <div
              key={signer.email}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0.75rem",
                background: "#f8faf9",
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div style={styles.avatar()}>
                {(signer.name || signer.email).slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "0.93rem" }}>
                  {signer.name || signer.email}
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: COLORS.muted }}>{signer.email}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={styles.badge(signer.status)}>
                  {signer.status === "signed" ? "✓ Signé" : signer.invited ? "Invité" : "En attente"}
                </span>
                {signer.signedAt && (
                  <span style={{ fontSize: "0.72rem", color: COLORS.muted }}>{signer.signedAt}</span>
                )}
                {signer.invited && signer.status !== "signed" && (
                  <span style={{ fontSize: "0.72rem", color: COLORS.amber }}>📧 Email envoyé</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CREATE DOCUMENT MODAL ──────────────────────────────────────────────────────
function CreateDocModal({ user, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emails, setEmails] = useState([""]);

  const addEmail = () => setEmails([...emails, ""]);
  const updateEmail = (i, v) => { const ne = [...emails]; ne[i] = v; setEmails(ne); };
  const removeEmail = (i) => setEmails(emails.filter((_, j) => j !== i));

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title) return;
    const otherSigners = emails
      .filter((e) => e.includes("@") && e !== user.email)
      .map((e) => ({ email: e, name: e.split("@")[0], status: "pending", invited: true }));

    onCreate({
      id: Date.now(),
      title,
      content,
      status: "pending",
      createdAt: new Date().toLocaleDateString("fr-FR"),
      signers: [
        { email: user.email, name: user.name, status: "pending" },
        ...otherSigners,
      ],
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,30,25,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ ...styles.card, width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Nouveau document</h3>
          <button onClick={onClose} style={styles.btnDanger}>✕</button>
        </div>

        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: 14 }}>
            <label style={styles.label}>Titre du document</label>
            <input
              style={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contrat de prestation, NDA, Bail..."
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Contenu / description (optionnel)</label>
            <textarea
              style={{ ...styles.input, height: 100, resize: "vertical", fontFamily: "inherit" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Insérez ici le corps du document ou une description..."
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={styles.label}>Inviter des signataires (emails)</label>
            <p style={{ margin: "0 0 10px", fontSize: "0.82rem", color: COLORS.muted }}>
              Vous serez automatiquement ajouté comme signataire
            </p>
            {emails.map((email, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                  style={{ ...styles.input, flex: 1 }}
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(i, e.target.value)}
                  placeholder="cosignataire@exemple.com"
                />
                {emails.length > 1 && (
                  <button type="button" onClick={() => removeEmail(i)} style={styles.btnDanger}>✕</button>
                )}
              </div>
            ))}
            <button type="button" style={{ ...styles.btnOutline, fontSize: "0.85rem", padding: "0.5rem 1rem", marginTop: 4 }} onClick={addEmail}>
              + Ajouter
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" style={styles.btnOutline} onClick={onClose}>Annuler</button>
            <button type="submit" style={styles.btn}>Créer le document</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── DASHBOARD ──────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout, onOpenDoc }) {
  const [docs, setDocs] = useState([
    {
      id: 1,
      title: "Contrat de prestation — Mars 2025",
      status: "pending",
      createdAt: "15/03/2025",
      signers: [
        { email: user.email, name: user.name, status: "pending" },
        { email: "client@exemple.com", name: "Client", status: "pending", invited: true },
      ],
    },
    {
      id: 2,
      title: "NDA — Projet Alpha",
      status: "completed",
      createdAt: "02/03/2025",
      signers: [
        { email: user.email, name: user.name, status: "signed", signedAt: "02/03/2025 14:32" },
        { email: "partenaire@startup.io", name: "Marie L.", status: "signed", signedAt: "03/03/2025 09:15", invited: true },
      ],
    },
  ]);
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = (doc) => setDocs([doc, ...docs]);
  const handleUpdateDoc = (updated) => setDocs(docs.map((d) => (d.id === updated.id ? updated : d)));

  const myPending = docs.filter((d) => d.signers.some((s) => s.email === user.email && s.status !== "signed"));
  const completed = docs.filter((d) => d.status === "completed");

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg }}>
      {showCreate && <CreateDocModal user={user} onClose={() => setShowCreate(false)} onCreate={handleCreate} />}

      {/* Nav */}
      <nav
        style={{
          background: COLORS.white,
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill={COLORS.green} />
            <path d="M14 6L7 10v4c0 4.4 3 8.5 7 9.5 4-1 7-5.1 7-9.5v-4L14 6z" fill="white" opacity="0.9"/>
            <path d="M11.5 14l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: "1.05rem", color: COLORS.green, letterSpacing: "-0.02em" }}>TrustID</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ ...styles.avatar(), width: 36, height: 36, fontSize: "0.82rem" }}>
            {user.initials}
          </div>
          <div style={{ fontSize: "0.88rem" }}>
            <p style={{ margin: 0, fontWeight: 600 }}>{user.name}</p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: COLORS.muted }}>{user.email}</p>
          </div>
          <button style={{ ...styles.btnDanger, padding: "0.4rem 0.9rem" }} onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </nav>

      <main style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: "1.5rem" }}>
          {[
            { label: "Documents totaux", val: docs.length, icon: "📄" },
            { label: "En attente de signature", val: myPending.length, icon: "⏳" },
            { label: "Complétés", val: completed.length, icon: "✅" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                ...styles.card,
                display: "flex",
                gap: 14,
                alignItems: "center",
                padding: "1rem 1.2rem",
              }}
            >
              <span style={{ fontSize: "1.6rem" }}>{s.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>{s.val}</p>
                <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: COLORS.muted }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Mes documents</h2>
          <button style={styles.btn} onClick={() => setShowCreate(true)}>
            + Nouveau document
          </button>
        </div>

        {/* Doc list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {docs.map((doc) => {
            const myEntry = doc.signers.find((s) => s.email === user.email);
            const progress = Math.round(
              (doc.signers.filter((s) => s.status === "signed").length / doc.signers.length) * 100
            );
            return (
              <div
                key={doc.id}
                style={{
                  ...styles.card,
                  cursor: "pointer",
                  transition: "box-shadow 0.15s",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                }}
                onClick={() => onOpenDoc(doc, handleUpdateDoc)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,102,79,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,102,79,0.06)")}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 10,
                    background: COLORS.greenLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    flexShrink: 0,
                  }}
                >
                  📄
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {doc.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 5, background: COLORS.greenLight, borderRadius: 99, maxWidth: 120 }}>
                      <div style={{ height: "100%", width: `${progress}%`, background: COLORS.green, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: "0.76rem", color: COLORS.muted }}>
                      {doc.signers.filter((s) => s.status === "signed").length}/{doc.signers.length} signé{doc.signers.filter((s) => s.status === "signed").length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <span style={styles.badge(myEntry?.status === "signed" ? "signed" : doc.status === "completed" ? "signed" : "pending")}>
                    {myEntry?.status === "signed" ? "✓ Vous avez signé" : doc.status === "completed" ? "✓ Complété" : "À signer"}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: COLORS.muted }}>{doc.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {docs.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: COLORS.muted }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📭</div>
            <p style={{ fontWeight: 600 }}>Aucun document</p>
            <p style={{ fontSize: "0.88rem" }}>Créez votre premier document à faire signer</p>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [updateFn, setUpdateFn] = useState(null);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => { setUser(null); setCurrentDoc(null); };
  const handleOpenDoc = (doc, updater) => {
    setCurrentDoc(doc);
    setUpdateFn(() => (updated) => {
      updater(updated);
      setCurrentDoc(updated);
    });
  };

  return (
    <div style={styles.app}>
      {!user ? (
        <AuthPage onLogin={handleLogin} />
      ) : currentDoc ? (
        <DocumentSignPage
          doc={currentDoc}
          user={user}
          onBack={() => setCurrentDoc(null)}
          onUpdate={updateFn}
        />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} onOpenDoc={handleOpenDoc} />
      )}
    </div>
  );
}
