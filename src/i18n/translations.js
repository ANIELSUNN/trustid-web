export const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

export const translations = {
  fr: {
    dir: 'ltr',
    nav: { login: 'Connexion' },
    badge: 'Signature électronique de confiance, faite pour l\'Afrique',
    hero: {
      title1: 'Accompagner votre',
      title2: 'transformation numérique',
      subtitle:
        "TrustID vous permet de signer, vérifier et archiver vos documents électroniques en toute sécurité, où que vous soyez.",
      cta: 'Commencer',
    },
    stats: [
      { value: '500+', label: 'Documents signés' },
      { value: '99.9%', label: 'Disponibilité garantie' },
      { value: '100%', label: 'Traçabilité des signatures' },
      { value: '24/7', label: 'Accès à vos documents' },
    ],
    features: {
      title: 'Une offre de service complète',
      items: [
        { title: 'Signature électronique', text: 'Signez vos documents directement au stylo numérique, en quelques secondes.' },
        { title: 'Vérification de documents', text: "Vérifiez l'authenticité et l'intégrité de tout document signé via TrustID." },
        { title: 'Historique & suivi', text: 'Retrouvez à tout moment l\'historique complet de vos signatures.' },
      ],
    },
    footer: 'TrustID — Identité Numérique Souveraine',
  },
  en: {
    dir: 'ltr',
    nav: { login: 'Sign in' },
    badge: 'Trusted electronic signature, built for Africa',
    hero: {
      title1: 'Supporting your',
      title2: 'digital transformation',
      subtitle:
        'TrustID lets you sign, verify and archive your electronic documents securely, wherever you are.',
      cta: 'Get started',
    },
    stats: [
      { value: '500+', label: 'Documents signed' },
      { value: '99.9%', label: 'Guaranteed availability' },
      { value: '100%', label: 'Signature traceability' },
      { value: '24/7', label: 'Access to your documents' },
    ],
    features: {
      title: 'An end-to-end service offering',
      items: [
        { title: 'Electronic signature', text: 'Sign your documents with a digital pen in just a few seconds.' },
        { title: 'Document verification', text: 'Verify the authenticity and integrity of any document signed with TrustID.' },
        { title: 'History & tracking', text: 'Access the full history of your signatures at any time.' },
      ],
    },
    footer: 'TrustID — Sovereign Digital Identity',
  },
  ar: {
    dir: 'rtl',
    nav: { login: 'تسجيل الدخول' },
    badge: 'توقيع إلكتروني موثوق، مصمم لأفريقيا',
    hero: {
      title1: 'ندعم',
      title2: 'تحولكم الرقمي',
      subtitle: 'تتيح لك TrustID توقيع مستنداتك الإلكترونية والتحقق منها وأرشفتها بأمان، أينما كنت.',
      cta: 'ابدأ الآن',
    },
    stats: [
      { value: '+500', label: 'مستند موقّع' },
      { value: '%99.9', label: 'توفر مضمون' },
      { value: '%100', label: 'إمكانية تتبع التوقيعات' },
      { value: '24/7', label: 'الوصول إلى مستنداتك' },
    ],
    features: {
      title: 'عرض خدمة متكامل',
      items: [
        { title: 'توقيع إلكتروني', text: 'وقّع مستنداتك بقلم رقمي في ثوانٍ معدودة.' },
        { title: 'التحقق من المستندات', text: 'تحقق من صحة وسلامة أي مستند موقّع عبر TrustID.' },
        { title: 'السجل والمتابعة', text: 'اطّلع في أي وقت على السجل الكامل لتوقيعاتك.' },
      ],
    },
    footer: 'TrustID — هوية رقمية سيادية',
  },
};
