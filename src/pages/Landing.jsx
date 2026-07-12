import React from 'react';
import { Link } from 'react-router-dom';
import TrustIDLogo from '../components/TrustIDLogo';
import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES } from '../i18n/translations';
import styles from './Landing.module.css';

function LandingContent() {
  const { lang, setLang, t } = useLanguage();
  const isRtl = t.dir === 'rtl';

  return (
    <div className={`${styles.page} ${isRtl ? styles.rtl : ''}`} dir={t.dir}>
      <header className={styles.header}>
        <TrustIDLogo size={38} />
        <div className={styles.headerActions}>
          <select
            className={styles.langSelect}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Langue"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          <Link to="/login" className={styles.loginBtn}>{t.nav.login}</Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div>
          <span className={styles.badge}>{t.badge}</span>
          <h1 className={styles.title}>
            {t.hero.title1}<br />
            <span className={styles.titleAccent}>{t.hero.title2}</span>
          </h1>
          <p className={styles.subtitle}>{t.hero.subtitle}</p>
          <Link to="/login" className={styles.ctaBtn}>{t.hero.cta}</Link>
        </div>

        <div className={styles.statsGrid}>
          {t.stats.map((s) => (
            <div key={s.label} className={styles.statTile}>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <h2 className={styles.featuresTitle}>{t.features.title}</h2>
          <div className={styles.featureGrid}>
            {t.features.items.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <h3 className={styles.featureCardTitle}>{f.title}</h3>
                <p className={styles.featureCardText}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>{t.footer}</footer>
    </div>
  );
}

export default function Landing() {
  return (
    <LanguageProvider>
      <LandingContent />
    </LanguageProvider>
  );
}
